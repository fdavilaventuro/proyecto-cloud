import json
import boto3
import uuid
from datetime import datetime, timezone
import os
from decimal import Decimal, InvalidOperation
from common.db import pedidos_table
from common.response import json_response

sqs = boto3.resource('sqs')


def _convert_numbers_to_decimal(obj):
    """Recursively convert int/float values in obj to Decimal for DynamoDB."""
    if isinstance(obj, dict):
        return {k: _convert_numbers_to_decimal(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_convert_numbers_to_decimal(v) for v in obj]
    if isinstance(obj, float):
        # Use str() to avoid binary float issues
        return Decimal(str(obj))
    if isinstance(obj, int):
        return Decimal(obj)
    return obj


def _decimal_to_native(obj):
    """Convert Decimal instances to native Python types (int or float) for JSON serialization."""
    if isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_decimal_to_native(v) for v in obj]
    if isinstance(obj, Decimal):
        # If it's effectively an integer, return int, else float
        if obj == obj.to_integral_value():
            return int(obj)
        return float(obj)
    return obj


def lambda_handler(event, context):
    print("Evento Registro:", json.dumps(event))
    try:
        body = json.loads(event.get('body', '{}'))
        required_fields = ['storeId', 'client', 'address', 'total', 'items']
        for field in required_fields:
            if field not in body:
                return json_response({'error': f'Campo faltante: {field}'}, status=400)

        order_id = f"ORD-{str(uuid.uuid4())[:8].upper()}"
        timestamp = datetime.now(timezone.utc).isoformat()

        # Prepare pedido with numeric values converted to Decimal for DynamoDB
        pedido_native = {
            'id': order_id,
            'orderId': order_id,
            'storeId': body['storeId'],
            'client': {
                'name': body['client']['name'],
                'phone': body['client']['phone'],
                'email': body['client']['email'].lower() if body['client'].get('email') else ''
            },
            'address': body['address'],
            'total': body['total'],
            'status': 'PENDING',
            'items': body['items'],
            'createdAt': timestamp,
            'updatedAt': timestamp
        }

        # Convert numeric fields to Decimal for DynamoDB
        pedido = _convert_numbers_to_decimal(pedido_native)

        # Guardar en DynamoDB
        table = pedidos_table()
        table.put_item(Item=pedido)

        # Enviar a SQS: convert Decimals back to native types for JSON payload
        queue = sqs.get_queue_by_name(QueueName=os.environ['SQS_QUEUE'])
        pedido_for_queue = _decimal_to_native(pedido)
        queue.send_message(MessageBody=json.dumps({
            'action': 'PROCESS_ORDER',
            'orderId': order_id,
            'pedido': pedido_for_queue
        }))

        return json_response({'message': 'Pedido registrado exitosamente', 'orderId': order_id, 'status': 'PENDING'})
    except (InvalidOperation, ValueError) as e:
        print("Conversion error en registro:", str(e))
        return json_response({'error': f'Error interno: {str(e)}'}, status=500)
    except Exception as e:
        print("Error en registro:", str(e))
        return json_response({'error': f'Error interno: {str(e)}'}, status=500)
