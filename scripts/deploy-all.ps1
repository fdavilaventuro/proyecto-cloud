Param(
  [string]$Stage = "dev",
  [string]$Region = "us-east-1"
)

function Validate-ServerlessVars {
  $varsPath = Join-Path (Resolve-Path "..\serverless.vars.yml") '' 2>$null
  if (-not (Test-Path "../serverless.vars.yml")) {
    Write-Error "Missing ../serverless.vars.yml. Create it with 'accountId' and 'labRole'."
    exit 2
  }

  try {
    $yaml = Get-Content "../serverless.vars.yml" -Raw
    # crude parsing: find accountId and labRole
    $accountId = ($yaml -split "\n" | Where-Object { $_ -match '^accountId:' }) -replace 'accountId:\s*',''
    $labRole = ($yaml -split "\n" | Where-Object { $_ -match '^labRole:' }) -replace 'labRole:\s*',''
    $accountId = $accountId.Trim()
    $labRole = $labRole.Trim()
  } catch {
    Write-Error "Failed reading ../serverless.vars.yml: $_"
    exit 2
  }

  if (-not ($accountId -match '^[0-9]{12}$')) {
    Write-Error "Invalid accountId in serverless.vars.yml: '$accountId'. It must be a 12-digit AWS account id."
    exit 2
  }

  if ([string]::IsNullOrWhiteSpace($labRole)) {
    Write-Error "Invalid labRole in serverless.vars.yml: must be non-empty."
    exit 2
  }

  Write-Host "serverless.vars.yml OK: accountId=$accountId labRole=$labRole"
}

Validate-ServerlessVars

Write-Host "Deploying kfc-workflow (creates Orders table, Step Function, EventBus)"
Push-Location "c:\Users\fdavi\Documents\proyecto cloud\kfc-workflow"
sls deploy -s $Stage
Pop-Location

# Get Step Function ARN from CloudFormation outputs (requires AWS CLI configured)
$workflowStack = "kfc-workflow-$Stage"
Write-Host "Fetching Step Function ARN from stack $workflowStack"
$stack = aws cloudformation describe-stacks --stack-name $workflowStack --region $Region | ConvertFrom-Json
$outputs = $stack.Stacks[0].Outputs
$sfArn = ($outputs | Where-Object { $_.OutputKey -eq 'KfcOrderFlowArn' }).OutputValue
if (-not $sfArn) {
  Write-Warning "KfcOrderFlowArn not found in stack outputs. Ensure kfc-workflow deployed correctly and outputs include KfcOrderFlowArn"
} else {
  Write-Host "Found Step Function ARN: $sfArn"
}

Write-Host "Deploying pedidos-backend (API + SQS). Will reference kfc-workflow outputs if available"
Push-Location "c:\Users\fdavi\Documents\proyecto cloud\pedidos-backend"
sls deploy -s $Stage
Pop-Location

Write-Host "Deploying kfc-integraciones"
Push-Location "c:\Users\fdavi\Documents\proyecto cloud\kfc-integraciones"
sls deploy -s $Stage
Pop-Location

Write-Host "Done. If you want to run the smoke-test, use the script scripts\smoke-test.ps1 and pass the API URL reported by pedidos-backend (or find it in CloudFormation outputs)."
