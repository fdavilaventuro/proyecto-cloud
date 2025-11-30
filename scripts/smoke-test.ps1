Param(
    [string]$ApiUrl = "",
    [string]$Stage = "dev",
    [string]$Region = "us-east-1",
    [int]$PollIntervalSeconds = 3,
    [int]$TimeoutSeconds = 300
)

function Get-ApiUrlFromCloudFormation {
    param($stackName, $region)
    try {
        $stack = aws cloudformation describe-stacks --stack-name $stackName --region $region | ConvertFrom-Json
        $outputs = $stack.Stacks[0].Outputs
        $api = ($outputs | Where-Object { $_.OutputKey -eq 'ApiUrl' -or $_.OutputKey -eq 'PedidosApiUrl' }).OutputValue
        return $api
    } catch {
        Write-Warning "Could not get stack outputs for $stackName: $_"
        return $null
    }
}

# If ApiUrl not provided, try to auto-discover from CloudFormation
if (-not $ApiUrl -or $ApiUrl -eq '') {
    $stackName = "pedidos-api-$Stage"
    Write-Host "No ApiUrl provided; attempting to discover from CloudFormation stack $stackName in $Region"
    $found = Get-ApiUrlFromCloudFormation -stackName $stackName -region $Region
    if ($found) {
        $ApiUrl = $found
        Write-Host "Discovered API URL: $ApiUrl"
    } else {
        Write-Warning "Could not discover ApiUrl; please pass -ApiUrl parameter."
        exit 2
    }
}

Write-Host "Using API: $ApiUrl"

$body = @{storeId='S1'; client='Test User'; address='123 Main'; total=15.5; items=@(@{productId='P1'; qty=1; price=15.5})} | ConvertTo-Json -Depth 5

Write-Host "Creating order..."
try {
    $createResp = Invoke-RestMethod -Uri "$ApiUrl/order" -Method Post -Headers @{"Content-Type"="application/json"} -Body $body -ErrorAction Stop
} catch {
    Write-Error "Failed to create order: $_"
    exit 1
}
Write-Host "Response:" ($createResp | ConvertTo-Json)

if (-not $createResp.orderId) {
    Write-Error "No orderId returned. Aborting."
    exit 1
}

$orderId = $createResp.orderId
Write-Host "Order created: $orderId. Polling status..."

$deadline = (Get-Date).AddSeconds($TimeoutSeconds)
while ((Get-Date) -lt $deadline) {
    Start-Sleep -Seconds $PollIntervalSeconds
    try {
        $statusResp = Invoke-RestMethod -Uri "$ApiUrl/status?orderId=$orderId" -Method Get -ErrorAction Stop
        Write-Host "Status:" ($statusResp.currentStatus)
        if ($statusResp.currentStatus -in @('DELIVERING','PAYMENT_REJECTED','PACKED')) {
            Write-Host "Final state reached: $($statusResp.currentStatus)"
            Write-Host "Full response:" ($statusResp | ConvertTo-Json -Depth 10)
            exit 0
        }
    } catch {
        Write-Warning "Failed to fetch status: $_"
    }
}

Write-Error "Timeout waiting for order final state."
exit 2
