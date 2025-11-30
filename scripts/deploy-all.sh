#!/bin/bash

Stage=${1:-dev}
Region=${2:-us-east-1}

# Function to validate serverless.vars.yml
validate_serverless_vars() {
    if [ ! -f "serverless.vars.yml" ]; then
        echo "Error: Missing serverless.vars.yml. Create it with 'accountId' and 'labRole'."
        exit 2
    fi

    # Extract values using grep and sed (crude but portable)
    accountId=$(grep "^accountId:" serverless.vars.yml | sed 's/accountId:\s*//')
    labRole=$(grep "^labRole:" serverless.vars.yml | sed 's/labRole:\s*//')

    # Trim whitespace
    accountId=$(echo "$accountId" | xargs)
    labRole=$(echo "$labRole" | xargs)

    # Validate accountId (12 digits)
    if ! [[ "$accountId" =~ ^[0-9]{12}$ ]]; then
        echo "Error: Invalid accountId in serverless.vars.yml: '$accountId'. It must be a 12-digit AWS account id."
        exit 2
    fi

    # Validate labRole (non-empty)
    if [ -z "$labRole" ]; then
        echo "Error: Invalid labRole in serverless.vars.yml: must be non-empty."
        exit 2
    fi

    echo "serverless.vars.yml OK: accountId=$accountId labRole=$labRole"
}

validate_serverless_vars

# Ensure EventBridge bus exists
echo "Ensuring EventBridge bus 'orders-bus' exists..."
aws events describe-event-bus --name orders-bus --region "$Region" 2>/dev/null || {
    echo "Creating EventBridge bus 'orders-bus'"
    aws events create-event-bus --name orders-bus --region "$Region"
}

echo "Deploying pedidos-backend (API + SQS). This will export the Pedidos table name for other stacks"
cd pedidos-backend
npm install
sls deploy -s "$Stage" --region "$Region"
cd ..

# Get Step Function ARN from CloudFormation outputs after workflow deploy
echo "Deploying kfc-workflow (creates Step Function)"
cd kfc-workflow
npm install
sls deploy -s "$Stage" --region "$Region"
cd ..

workflowStack="kfc-workflow-$Stage"
echo "Fetching Step Function ARN from stack $workflowStack"
sfArn=$(aws cloudformation describe-stacks --stack-name "$workflowStack" --region "$Region" --query "Stacks[0].Outputs[?OutputKey=='KfcOrderFlowArn'].OutputValue" --output text)

if [ -z "$sfArn" ] || [ "$sfArn" = "None" ]; then
    echo "Warning: KfcOrderFlowArn not found in stack outputs. Ensure kfc-workflow deployed correctly."
else
    echo "Found Step Function ARN: $sfArn"
fi

echo "Skipping kfc-integraciones (marked for removal - unused stack)"
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Architecture:"
echo "  - Payment: Automated via Step Functions (kfc-workflow)"
echo "  - Kitchen/Packing/Delivery: Employee-driven via API endpoints"
echo ""
echo "To test the hybrid workflow, run:"
echo "  bash scripts/smoke-test-hybrid.sh $Stage $Region"
echo ""
echo "Employee endpoints available:"
echo "  PUT /employee/order/{id}/kitchen-ready"
echo "  PUT /employee/order/{id}/packed"
echo "  PUT /employee/order/{id}/deliver"
