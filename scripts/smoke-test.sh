#!/bin/bash

# Handle different argument patterns:
# bash smoke-test.sh <full-url>
# bash smoke-test.sh <stage> <region>
# bash smoke-test.sh (auto-discover from CloudFormation)

Arg1="${1:-}"
Arg2="${2:-us-east-1}"
Arg3="${3:-3}"
Arg4="${4:-300}"

ApiUrl=""
Stage="dev"
Region="us-east-1"

# If first arg looks like a URL (contains https://), use it directly
if [[ "$Arg1" == https://* ]]; then
    ApiUrl="$Arg1"
    Stage="$Arg2"
    Region="$Arg3"
    PollIntervalSeconds="$Arg4"
else
    # Otherwise treat as stage and region
    Stage="${Arg1:-dev}"
    Region="${Arg2:-us-east-1}"
    PollIntervalSeconds="${Arg3:-3}"
    TimeoutSeconds="${Arg4:-300}"
fi

# Function to auto-discover API URL from CloudFormation
get_api_url_from_cloudformation() {
    local stackName=$1
    local region=$2
    
    if ! command -v aws &> /dev/null; then
        echo "AWS CLI not found. Please pass URL directly or install AWS CLI." >&2
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
    echo "Auto-discovering API URL from CloudFormation stack $stackName in region $Region"
    found=$(get_api_url_from_cloudformation "$stackName" "$Region")
    
    if [ -z "$found" ]; then
        echo "Error: Could not discover ApiUrl. Please pass it as: bash scripts/smoke-test.sh https://<API>.execute-api.<region>.amazonaws.com/<stage> <stage> <region>" >&2
        exit 2
    fi
    
    ApiUrl="$found"
fi

echo "Using API: $ApiUrl"

# Create order
body='{"storeId":"S1","client":"Test User","address":"123 Main","total":15.5,"items":[{"productId":"P1","qty":1,"price":15.5}]}'

echo "Creating order..."
echo "POST $ApiUrl/order"
echo "Body: $body"
createResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ApiUrl/order" \
    -H "Content-Type: application/json" \
    -d "$body")

httpStatus=$(echo "$createResp" | grep HTTP_STATUS | cut -d: -f2)
bodyResp=$(echo "$createResp" | sed '$d')

echo "HTTP Status: $httpStatus"
echo "Response Body: $bodyResp"

# Extract orderId using grep and sed
orderId=$(echo "$bodyResp" | grep -o '"orderId":"[^"]*"' | sed 's/"orderId":"\(.*\)"/\1/')

if [ -z "$orderId" ]; then
    echo "Error: No orderId returned. Full response was: $bodyResp" >&2
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
