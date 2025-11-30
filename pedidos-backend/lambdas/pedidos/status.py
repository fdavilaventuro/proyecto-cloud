import json
import os
from decimal import Decimal
from common.db import pedidos_table
from common.response import json_response


def _decimal_to_native(obj):
    if isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_decimal_to_native(v) for v in obj]
    if isinstance(obj, Decimal):
        if obj == obj.to_integral_value():
            return int(obj)
        return float(obj)
    return obj


def lambda_handler(event, context):
    print("Evento Status:", json.dumps(event))
    params = event.get('queryStringParameters') or {}
    order_id = params.get('orderId')
    if not order_id:
        return json_response({'error': 'Parámetro orderId requerido'}, status=400)
    try:
        table = pedidos_table()
        response = table.get_item(Key={'id': order_id})
        if 'Item' not in response:
            return json_response({'error': 'Pedido no encontrado'}, status=404)

        item = response['Item']
        # Provide a stable field name for current status expected by clients
        item_native = _decimal_to_native(item)
        item_native['currentStatus'] = item_native.get('status')

        return json_response(item_native)
    except Exception as e:
        print("Error en status:", str(e))
        return json_response({'error': 'Error al obtener pedido'}, status=500)
