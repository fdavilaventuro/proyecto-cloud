import json
import boto3
import time
import os
from datetime import datetime
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
events = boto3.client('events')
table = dynamodb.Table(os.environ.get('TABLE_NAME', 'Orders'))
event_bus = os.environ.get('EVENT_BUS', 'orders-bus')

def lambda_handler(event, context):
    print(f"--- INICIO PAGOS (MS Pagos) --- ID: {event.get('id')}")
    # Debug: print which DynamoDB table name this lambda is configured to use
    configured_table_env = os.environ.get('TABLE_NAME')
    print(f"Configured TABLE_NAME env: {configured_table_env}")
    # boto3 Table object exposes the table name via attribute 'table_name' on the resource.Table
    try:
        print(f"boto3 Table object name: {getattr(table, 'table_name', None)}")
    except Exception:
        pass
    
    # Validamos que llegue el ID
    if 'id' not in event:
        raise ValueError("Falta el ID del pedido")

    order_id = event['id']
    
    # 1. Validar pago con Stripe (simulación)
    time.sleep(2)  # Simular latencia de Stripe
    
    # Simular rechazo de pago si:
    # El cliente contiene "Sin Fondos" (tarjeta rechazada)
    total = event.get('total', 0)
    client = event.get('client', '')
    
    if 'Sin Fondos' in client or 'sin fondos' in client.lower():
        print(f"Pago RECHAZADO para orden {order_id} - Cliente: {client}, Total: {total}")
        # Actualizar estado a REJECTED
        max_retries = 3
        for attempt in range(max_retries):
            try:
                table.update_item(
                    Key={'id': order_id},
                    UpdateExpression="SET #s = :status, updatedAt = :now",
                    ExpressionAttributeNames={'#s': 'status'},
                    ExpressionAttributeValues={
                        ':status': 'PAYMENT_REJECTED',
                        ':now': datetime.now().isoformat()
                    },
                    ConditionExpression='attribute_exists(id)'
                )
                print(f"Orden {order_id} actualizada a PAYMENT_REJECTED en DynamoDB")
                break
            except ClientError as e:
                # If conditional check failed, the item might not exist yet; retry a few times
                code = e.response.get('Error', {}).get('Code')
                if code == 'ConditionalCheckFailedException' and attempt < max_retries - 1:
                    print(f"ConditionalCheckFailedException on PAYMENT_REJECTED update for {order_id}, retrying (attempt {attempt+1})")
                    try:
                        resp = table.get_item(Key={'id': order_id})
                        print(f"Debug get_item during retry: {'found' if 'Item' in resp else 'not found'} for {order_id}")
                    except Exception as ie:
                        print(f"Debug: get_item failed during retry: {ie}")
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                else:
                    print(f"Error actualizando DynamoDB: {str(e)}")
                    break
            except Exception as e:
                print(f"Error actualizando DynamoDB: {str(e)}")
                break
        
        # Retornar estado rechazado para que el workflow lo maneje
        event['status'] = 'PAYMENT_REJECTED'
        event['paymentId'] = None
        return event
    
    payment_id = f"PAY-STRIPE-{int(time.time())}"
    
    # 2. Actualizar DynamoDB con el estado PAID
    try:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                table.update_item(
                    Key={'id': order_id},
                    UpdateExpression="SET #s = :status, paymentId = :pid, updatedAt = :now",
                    ExpressionAttributeNames={'#s': 'status'},
                    ExpressionAttributeValues={
                        ':status': 'PAID',
                        ':pid': payment_id,
                        ':now': datetime.now().isoformat()
                    },
                    ConditionExpression='attribute_exists(id)'  # La orden debe existir
                )
                print(f"Orden {order_id} actualizada a PAID en DynamoDB")
                break
            except ClientError as e:
                code = e.response.get('Error', {}).get('Code')
                if code == 'ConditionalCheckFailedException' and attempt < max_retries - 1:
                    # Item may not be available yet - log and retry
                    print(f"ConditionalCheckFailedException on PAID update for {order_id}, retrying (attempt {attempt+1})")
                    try:
                        resp = table.get_item(Key={'id': order_id})
                        if 'Item' in resp:
                            print(f"Debug: get_item found item for {order_id} during retry: {resp.get('Item')}")
                        else:
                            print(f"Debug: get_item returned no Item for {order_id} during retry")
                    except Exception as ie:
                        print(f"Debug: get_item failed during retry: {ie}")
                    time.sleep(0.5 * (2 ** attempt))
                    continue
                else:
                    # Re-raise non-conditional errors
                    raise
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            error_msg = f"Orden {order_id} no existe en DynamoDB. Debe ser creada por el backend primero."
            print(f"ERROR: {error_msg}")
            # Try to read the item to gather debug information (GetItem uses allowed permission)
            try:
                resp = table.get_item(Key={'id': order_id})
                if 'Item' in resp:
                    print(f"Debug: get_item found item for {order_id}: {resp.get('Item')}")
                else:
                    print(f"Debug: get_item returned no Item for {order_id}")
            except Exception as ie:
                print(f"Debug: get_item failed: {ie}")
            raise ValueError(error_msg)
        else:
            print(f"Error actualizando DynamoDB: {str(e)}")
            raise
    except Exception as e:
        print(f"Error actualizando DynamoDB: {str(e)}")
        raise
    
    # 3. Enviar evento ORDER.PAID a EventBridge
    try:
        events.put_events(
            Entries=[{
                'Source': 'kfc.orders',
                'DetailType': 'ORDER.PAID',
                'EventBusName': event_bus,
                'Detail': json.dumps({
                    'orderId': order_id,
                    'paymentId': payment_id
                })
            }]
        )
        print(f"Evento ORDER.PAID enviado a EventBridge para orden {order_id}")
    except Exception as e:
        print(f"Advertencia: No se pudo enviar evento a EventBridge: {str(e)}")
    
    # 4. Retornar datos para el siguiente paso del workflow
    event['status'] = 'PAID'
    event['paymentId'] = payment_id
    return event