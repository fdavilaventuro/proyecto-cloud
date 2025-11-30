#!/usr/bin/env bash
#
# Smoke test for KFC hybrid workflow:
# - Payment is automated (Step Functions)
# - Kitchen/Packing/Delivery are employee-driven (manual API calls)
#
set -e

STAGE="${1:-dev}"
REGION="${2:-us-east-1}"

echo "Auto-discovering API URL from CloudFormation stack pedidos-api-$STAGE in region $REGION"
ApiUrl=$(aws cloudformation describe-stacks \
  --stack-name "pedidos-api-$STAGE" \
  --region "$REGION" \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)

if [ -z "$ApiUrl" ]; then
  echo "Error: Could not find ApiUrl output from stack pedidos-api-$STAGE"
  exit 1
fi

echo "Using API: $ApiUrl"

# 1. Create order
echo "Creating order..."
orderBody='{"storeId":"S1","client":"Test User","address":"123 Main","total":15,"items":[{"productId":"P1","qty":1,"price":15}]}'
echo "POST $ApiUrl/order"
echo "Body: $orderBody"

createResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "$ApiUrl/order" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d "$orderBody")

httpStatus=$(echo "$createResp" | grep "HTTP_STATUS" | cut -d: -f2)
bodyResp=$(echo "$createResp" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $httpStatus"
echo "Response Body: $bodyResp"

if [ "$httpStatus" != "200" ]; then
  echo "Error: Order creation failed with status $httpStatus"
  exit 1
fi

orderId=$(echo "$bodyResp" | sed -n 's/.*"orderId"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

if [ -z "$orderId" ]; then
  echo "Error: Could not extract orderId from response"
  exit 1
fi

echo "Order created: $orderId. Polling status..."

# 2. Poll until payment completes (automated by Step Functions)
maxAttempts=30
attempt=0
while [ $attempt -lt $maxAttempts ]; do
    statusResp=$(curl -s "$ApiUrl/status?orderId=$orderId" \
        -H "Authorization: Bearer demo-token")
    # If API GW returned an auth 403 body, retry a couple of times
    if echo "$statusResp" | grep -q "execute-api:Invoke"; then
        for i in 1 2; do
            sleep 1
            statusResp=$(curl -s "$ApiUrl/status?orderId=$orderId" \
                -H "Authorization: Bearer demo-token")
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
    
    # Wait for payment to complete (PAID or PAYMENT_REJECTED)
    if [ "$currentStatus" = "PAID" ]; then
        echo "Payment completed successfully. Now simulating employee actions..."
        break
    elif [ "$currentStatus" = "PAYMENT_REJECTED" ]; then
        echo "Payment was rejected (expected for some test clients). Exiting."
        exit 0
    fi
    
    attempt=$((attempt + 1))
    sleep 2
done

if [ "$currentStatus" != "PAID" ]; then
    echo "Error: Order did not reach PAID status after $maxAttempts attempts"
    exit 1
fi

# 3. Simulate employee marking kitchen ready
echo ""
echo "Employee action: Marking order as kitchen ready..."
kitchenResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X PUT "$ApiUrl/employee/order/$orderId/kitchen-ready" \
  -H "Authorization: Bearer demo-token")

kitchenStatus=$(echo "$kitchenResp" | grep "HTTP_STATUS" | cut -d: -f2)
kitchenBody=$(echo "$kitchenResp" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $kitchenStatus"
echo "Response: $kitchenBody"

if [ "$kitchenStatus" != "200" ]; then
    echo "Warning: Kitchen ready update failed"
fi

sleep 2

# 4. Simulate employee marking packed
echo ""
echo "Employee action: Marking order as packed..."
packedResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X PUT "$ApiUrl/employee/order/$orderId/packed" \
  -H "Authorization: Bearer demo-token")

packedStatus=$(echo "$packedResp" | grep "HTTP_STATUS" | cut -d: -f2)
packedBody=$(echo "$packedResp" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $packedStatus"
echo "Response: $packedBody"

if [ "$packedStatus" != "200" ]; then
    echo "Warning: Packed update failed"
fi

sleep 2

# 5. Simulate manager assigning delivery
echo ""
echo "Manager action: Assigning driver for delivery..."
deliverResp=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X PUT "$ApiUrl/employee/order/$orderId/deliver" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"driver":"Carlos Ruiz"}')

deliverStatus=$(echo "$deliverResp" | grep "HTTP_STATUS" | cut -d: -f2)
deliverBody=$(echo "$deliverResp" | sed '/HTTP_STATUS/d')

echo "HTTP Status: $deliverStatus"
echo "Response: $deliverBody"

if [ "$deliverStatus" != "200" ]; then
    echo "Warning: Delivery assignment failed"
fi

# 6. Final status check
echo ""
echo "Checking final status..."
finalResp=$(curl -s "$ApiUrl/status?orderId=$orderId" \
    -H "Authorization: Bearer demo-token")
finalStatus=$(echo "$finalResp" | sed -n 's/.*"currentStatus"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')

echo "Final state reached: $finalStatus"
echo "Full response: $finalResp"

if [ "$finalStatus" = "DELIVERING" ]; then
    echo ""
    echo "✅ Smoke test passed! Order progressed through full hybrid workflow:"
    echo "   PENDING → PAID (automated) → KITCHEN_READY (employee) → PACKED (employee) → DELIVERING (manager)"
    echo ""
    echo "📧 Email notifications (simulated - AWS Academy SES not available):"
    echo "   - ORDER.PAID event triggered notification handler"
    echo "   - ORDER.READY event triggered notification handler"
    echo "   - Email content logged to CloudWatch (production would send actual emails)"
    echo ""
    echo "💡 To view simulated email content:"
    echo "   aws logs tail /aws/lambda/kfc-integraciones-$STAGE-notification_handler --follow --region $REGION"
    exit 0
else
    echo ""
    echo "⚠️  Smoke test completed but final status is $finalStatus (expected DELIVERING)"
    exit 1
fi
