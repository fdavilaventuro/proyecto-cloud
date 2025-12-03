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

# Step 1: Register or login to get JWT token
testEmail="smoketest-$(date +%s)@example.com"
testPassword="TestPass123!"
testName="Smoke Test User"

echo ""
echo "Step 1: Registering test user..."
registerResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ApiUrl/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$testEmail\",\"password\":\"$testPassword\",\"name\":\"$testName\"}")

registerStatus=$(echo "$registerResp" | grep HTTP_STATUS | cut -d: -f2)
registerBody=$(echo "$registerResp" | sed '$d')

echo "Register HTTP Status: $registerStatus"

# Extract token from response using sed
token=$(echo "$registerBody" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

# If registration fails (user might already exist), try login
if [ -z "$token" ] || [ "$registerStatus" != "200" ]; then
    echo "Registration failed or user exists, attempting login..."
    
    # For smoke test, use a fixed test user instead
    testEmail="test@example.com"
    testPassword="test123"
    
    loginResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ApiUrl/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$testEmail\",\"password\":\"$testPassword\"}")
    
    loginStatus=$(echo "$loginResp" | grep HTTP_STATUS | cut -d: -f2)
    loginBody=$(echo "$loginResp" | sed '$d')
    
    echo "Login HTTP Status: $loginStatus"
    
    token=$(echo "$loginBody" | sed -n 's/.*"token"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
    
    if [ -z "$token" ]; then
        echo "Error: Failed to obtain authentication token" >&2
        echo "Login response: $loginBody" >&2
        exit 1
    fi
fi

echo "Successfully authenticated. Token obtained."
echo ""

# Create order
body='{"storeId":"S1","client":"Test User","address":"123 Main","total":15,"items":[{"productId":"P1","qty":1,"price":15}]}'

echo "Step 2: Creating order..."
echo "POST $ApiUrl/order"
echo "Body: $body"
createResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$ApiUrl/order" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d "$body")

httpStatus=$(echo "$createResp" | grep HTTP_STATUS | cut -d: -f2)
bodyResp=$(echo "$createResp" | sed '$d')

echo "HTTP Status: $httpStatus"
echo "Response Body: $bodyResp"

# Extract orderId using grep and sed
orderId=$(echo "$bodyResp" | sed -n 's/.*"orderId"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

if [ -z "$orderId" ]; then
    echo "Error: No orderId returned. Full response was: $bodyResp" >&2
    exit 1
fi

echo "Order created: $orderId. Polling status..."

deadline=$(($(date +%s) + TimeoutSeconds))
while [ $(date +%s) -lt $deadline ]; do
    sleep "$PollIntervalSeconds"
    
    statusResp=$(curl -s "$ApiUrl/status?orderId=$orderId" \
        -H "Authorization: Bearer $token")
    # If API GW returned an auth 403 body, retry a couple of times
    if echo "$statusResp" | grep -q "execute-api:Invoke"; then
        for i in 1 2; do
            sleep 1
            statusResp=$(curl -s "$ApiUrl/status?orderId=$orderId" \
                -H "Authorization: Bearer $token")
            if ! echo "$statusResp" | grep -q "execute-api:Invoke"; then
                break
            fi
        done
    fi
        currentStatus=$(echo "$statusResp" | sed -n 's/.*"currentStatus"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
    
    if [ -z "$currentStatus" ]; then
        echo "Status: "
        echo "Raw status response: $statusResp"
    else
        echo "Status: $currentStatus"
    fi
    
    if echo "$currentStatus" | grep -qE "DELIVERING|PAYMENT_REJECTED|PACKED"; then
        echo "Final state reached: $currentStatus"
        echo "Full response: $statusResp"
        exit 0
    fi
done

echo "Error: Timeout waiting for order final state." >&2
exit 2
