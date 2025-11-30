#!/bin/bash

ApiUrl="${1:-}"
Stage="${2:-dev}"
Region="${3:-us-east-1}"
PollIntervalSeconds="${4:-3}"
TimeoutSeconds="${5:-300}"

# Function to auto-discover API URL from CloudFormation
get_api_url_from_cloudformation() {
    local stackName=$1
    local region=$2
    
    if ! command -v aws &> /dev/null; then
        echo "AWS CLI not found. Please pass -ApiUrl directly or install AWS CLI." >&2
        return 1
    fi

    apiUrl=$(aws cloudformation describe-stacks --stack-name "$stackName" --region "$region" --query "Stacks[0].Outputs[?OutputKey=='ApiUrl' || OutputKey=='PedidosApiUrl'].OutputValue" --output text 2>/dev/null)
    
    if [ -z "$apiUrl" ] || [ "$apiUrl" = "None" ]; then
        return 1
    fi
    
    echo "$apiUrl"
}

# If ApiUrl not provided, try to auto-discover
if [ -z "$ApiUrl" ]; then
    stackName="pedidos-api-$Stage"
    echo "No ApiUrl provided; attempting to discover from CloudFormation stack $stackName in $Region"
    found=$(get_api_url_from_cloudformation "$stackName" "$Region")
    
    if [ -z "$found" ]; then
        echo "Error: Could not discover ApiUrl. Please pass it as: bash scripts/smoke-test.sh https://<API>.execute-api.<region>.amazonaws.com/<stage>" >&2
        exit 2
    fi
    
    ApiUrl="$found"
    echo "Discovered API URL: $ApiUrl"
fi

echo "Using API: $ApiUrl"

# Create order
body='{"storeId":"S1","client":"Test User","address":"123 Main","total":15.5,"items":[{"productId":"P1","qty":1,"price":15.5}]}'

echo "Creating order..."
createResp=$(curl -s -X POST "$ApiUrl/order" \
    -H "Content-Type: application/json" \
    -d "$body")

echo "Response: $createResp"

# Extract orderId using grep and sed
orderId=$(echo "$createResp" | grep -o '"orderId":"[^"]*"' | sed 's/"orderId":"\(.*\)"/\1/')

if [ -z "$orderId" ]; then
    echo "Error: No orderId returned. Aborting." >&2
    exit 1
fi

echo "Order created: $orderId. Polling status..."

deadline=$(($(date +%s) + TimeoutSeconds))
while [ $(date +%s) -lt $deadline ]; do
    sleep "$PollIntervalSeconds"
    
    statusResp=$(curl -s "$ApiUrl/status?orderId=$orderId")
    currentStatus=$(echo "$statusResp" | grep -o '"currentStatus":"[^"]*"' | sed 's/"currentStatus":"\(.*\)"/\1/')
    
    echo "Status: $currentStatus"
    
    if echo "$currentStatus" | grep -qE "DELIVERING|PAYMENT_REJECTED|PACKED"; then
        echo "Final state reached: $currentStatus"
        echo "Full response: $statusResp"
        exit 0
    fi
done

echo "Error: Timeout waiting for order final state." >&2
exit 2
