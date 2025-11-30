import json
import os
from datetime import datetime
from common.db import pedidos_table
from common.response import json_response
import boto3

# Optional: start a Step Functions execution when processing an order.
# Set environment variable `STEP_FUNCTION_ARN` to the state machine ARN to enable.
# We'll create the Step Functions client at runtime to ensure the current environment
# variable value is used (avoids import-time capture issues).

def lambda_handler(event, context):
    print("Evento Procesamiento SQS:", json.dumps(event))
    table = pedidos_table()
    for record in event.get('Records', []):
        try:
            message = json.loads(record['body'])
            order_id = message.get('orderId')
            print(f"Procesando pedido: {order_id}")

            # Actualizar estado a PROCESSING
            table.update_item(
                Key={'id': order_id},
                UpdateExpression='SET #s = :new_status, updatedAt = :now',
                ExpressionAttributeNames={'#s': 'status'},
                ExpressionAttributeValues={
                    ':new_status': 'PROCESSING',
                    ':now': datetime.utcnow().isoformat()
                }
            )
            print(f"Pedido {order_id} marcado como PROCESSING")

            # Si está configurado, iniciar la ejecución del Step Function
            step_arn = os.environ.get('STEP_FUNCTION_ARN')
            if step_arn:
                try:
                    # Create client at runtime
                    sf_client_local = boto3.client('stepfunctions')
                    # Construir input mínimo esperado por la máquina de estados
                    input_payload = json.dumps({
                        'id': order_id,
                        'total': message.get('pedido', {}).get('total'),
                        'client': message.get('pedido', {}).get('client'),
                        'items': message.get('pedido', {}).get('items')
                    })
                    exec_name = f"exec-{order_id}-{int(datetime.utcnow().timestamp())}"
                    print(f"Starting StepFunction for {order_id} with ARN {step_arn} and name {exec_name}")
                    resp = sf_client_local.start_execution(
                        stateMachineArn=step_arn,
                        name=exec_name,
                        input=input_payload
                    )
                    print(f"StepFunction started for {order_id}: {resp.get('executionArn')}")
                except Exception as e:
                    print(f"Warning: failed to start StepFunction for {order_id}: {e}")
            else:
                print("STEP_FUNCTION_ARN not set; skipping state machine start.")
        except Exception as e:
            print(f"Error procesando mensaje: {str(e)}")
            # SQS reintenta y al tercer intento DLQ recogerá el mensaje
    return json_response({'message': 'Procesamiento completado'})
