# Integration Guide (KFC University Project)

This guide explains how to integrate and test the `kfcfront`, `pedidos-backend`, `kfc-workflow`, and `kfc-integraciones` services.

Prerequisites
- AWS account and credentials configured locally (or use an AWS workshop role).
- `serverless` CLI installed and configured (`npm i -g serverless`).
- Python 3.9+ and Node 18+ for local builds.

Suggested deployment order
1. Deploy `kfc-workflow` (creates DynamoDB table and Step Functions state machine and event bus).
2. Deploy `pedidos-backend` (creates SQS queue and API Gateway). Configure `STEP_FUNCTION_ARN` env var to the state machine ARN from step 1.
3. Deploy `kfc-integraciones` (notifications, stripe simulator, utilities). Configure `TABLE_NAME` and `EVENT_BUS` to match step 1/2.
4. Deploy `kfcfront` or run locally with `npm run dev` (or pnpm). Set `NEXT_PUBLIC_API_URL` to the API Gateway URL from step 2.

Quick manual end-to-end test (after deploy)
- Create order (POST to `/order`):

```powershell
$body = '{"storeId":"S1","client":"Test User","address":"123 Main","total":25.0,"items":[{"productId":"P1","qty":1,"price":25.0}]}'
curl -X POST "https://<API_URL>/dev/order" -H "Content-Type: application/json" -d $body
```

- The backend will store the order and send it to SQS. The `procesamiento` lambda will mark it `PROCESSING` and start the Step Function.
- The Step Function runs `pagos`, `cocina`, `empaque`, `delivery` which update DynamoDB status and emit events.
- You can check order status:

```powershell
curl "https://<API_URL>/dev/status?orderId=ORD-XXXX"
```

Local testing without AWS
- You can still run individual Python modules for unit testing, but to run the full flow you'll need AWS resources or to mock `boto3`.
- See `.env.example` at the repository root for suggested env variables.

Testing on an EC2 VM (recommended for your school setup)
- Ensure AWS CLI is configured on the EC2 instance with credentials that can use the `LabRole` or your account.
- Update `serverless.vars.yml` if you want to change the `accountId` or `labRole` (all services read this file).

Deploy order (from repository root):

```powershell
# From the repo root on your EC2 VM
.\scripts\deploy-all.ps1 -Stage dev -Region us-east-1
```

Run the smoke test (auto-discovers API URL when possible):

```powershell
.\scripts\smoke-test.ps1 -Stage dev -Region us-east-1
# Or pass the ApiUrl directly
.\scripts\smoke-test.ps1 -ApiUrl 'https://<API>.execute-api.us-east-1.amazonaws.com/dev'
```

Run the frontend locally on EC2 (to run Next.js in production-like mode):

```powershell
cd kfcfront
pnpm install
pnpm run build
pnpm run start
# or for development
pnpm run dev
```

Open the browser on your EC2 instance (or a port-forward) and go to:
- `http://localhost:3000/pedir` to create an order
- `http://localhost:3000/pedir/status` to poll order status

Next steps I can take for you
- Wire `pedidos-backend` `serverless.yml` to automatically fill `STEP_FUNCTION_ARN` via outputs from `kfc-workflow` (cross-service linking).
- Add a `smoke-test` script that runs locally and invokes deployed endpoints to verify E2E.
- Refactor `kfcfront` to include a simple order form that calls the API automatically.

If you want, I can now:
- Attempt cross-service wiring in `serverless.yml` files (requires modifying deploy templates), or
- Create a `smoke-test.ps1` that you run locally against deployed endpoints.

