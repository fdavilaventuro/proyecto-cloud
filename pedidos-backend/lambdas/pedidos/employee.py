"""
Employee-facing endpoints for manual order status updates.
These are called by the employee frontend to transition orders through kitchen, packing, and delivery stages.
Sends EventBridge events for email notifications.
"""
import json
import os
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
from common.db import pedidos_table
from common.response import json_response

# EventBridge client for sending notification events
events = boto3.client('events')
EVENT_BUS = os.environ.get('EVENT_BUS', 'orders-bus')


def mark_kitchen_ready(event, context):
    """
    PUT /employee/order/{id}/kitchen-ready
    Employee marks order as ready from kitchen.
    """
    try:
        if 'pathParameters' not in event or 'id' not in event['pathParameters']:
            return json_response({'error': 'Parámetro de ruta faltante: {id}'}, 400)
        order_id = event['pathParameters']['id']
        table = pedidos_table()
        
        # Update status to KITCHEN_READY
        response = table.update_item(
            Key={'id': order_id},
            UpdateExpression="SET #s = :status, updatedAt = :now",
            ExpressionAttributeNames={'#s': 'status'},
            ConditionExpression='attribute_exists(id) AND #s = :current_status',
            ExpressionAttributeValues={
                ':status': 'KITCHEN_READY',
                ':now': datetime.now().isoformat(),
                ':current_status': 'PAID'
            },
            ReturnValues='ALL_NEW'
        )
        
        return json_response({
            'message': 'Orden marcada como lista en cocina',
            'order': response['Attributes']
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada o no está en estado PAID'}, 400)
        print(f"AWS ClientError in kitchen-ready: {repr(e)}")
        return json_response({'error': f'Error AWS en kitchen-ready: {code}'}, 500)
    except Exception as e:
        print(f"Error marking kitchen ready: {repr(e)}")
        return json_response({'error': f'Error interno en kitchen-ready: {type(e).__name__}: {str(e)}'}, 500)


def mark_packed(event, context):
    """
    PUT /employee/order/{id}/packed
    Employee marks order as packed and ready for pickup.
    """
    try:
        if 'pathParameters' not in event or 'id' not in event['pathParameters']:
            return json_response({'error': 'Parámetro de ruta faltante: {id}'}, 400)
        order_id = event['pathParameters']['id']
        table = pedidos_table()
        
        # Update status to PACKED
        response = table.update_item(
            Key={'id': order_id},
            UpdateExpression="SET #s = :status, updatedAt = :now",
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={
                ':status': 'PACKED',
                ':now': datetime.now().isoformat(),
                ':current_status': 'KITCHEN_READY'
            },
            ConditionExpression='attribute_exists(id) AND #s = :current_status',
            ReturnValues='ALL_NEW'
        )
        
        return json_response({
            'message': 'Orden marcada como empacada',
            'order': response['Attributes']
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada o no está en estado KITCHEN_READY'}, 400)
        print(f"AWS ClientError in packed: {repr(e)}")
        return json_response({'error': f'Error AWS en packed: {code}'}, 500)
    except Exception as e:
        print(f"Error marking packed: {repr(e)}")
        return json_response({'error': f'Error interno en packed: {type(e).__name__}: {str(e)}'}, 500)


def assign_delivery(event, context):
    """
    PUT /employee/order/{id}/deliver
    Manager assigns driver and marks order as out for delivery.
    Sends ORDER.READY event to trigger delivery notification email.
    Body: {"driver": "Driver Name"}
    """
    try:
        if 'pathParameters' not in event or 'id' not in event['pathParameters']:
            return json_response({'error': 'Parámetro de ruta faltante: {id}'}, 400)
        order_id = event['pathParameters']['id']
        body_raw = event.get('body', '{}')
        try:
            body = json.loads(body_raw or '{}')
        except Exception:
            return json_response({'error': 'Body inválido: debe ser JSON'}, 400)
        driver = body.get('driver', 'Driver Asignado')
        
        table = pedidos_table()
        
        # Update status to DELIVERING and assign driver
        response = table.update_item(
            Key={'id': order_id},
            UpdateExpression="SET #s = :status, driver = :driver, updatedAt = :now",
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={
                ':status': 'DELIVERING',
                ':driver': driver,
                ':now': datetime.now().isoformat(),
                ':current_status': 'PACKED'
            },
            ConditionExpression='attribute_exists(id) AND #s = :current_status',
            ReturnValues='ALL_NEW'
        )
        
        # Send ORDER.READY event to EventBridge for email notification
        try:
            events.put_events(
                Entries=[{
                    'Source': 'kfc.orders',
                    'DetailType': 'ORDER.READY',
                    'EventBusName': EVENT_BUS,
                    'Detail': json.dumps({'orderId': order_id, 'driver': driver})
                }]
            )
            print(f"ORDER.READY event sent to EventBridge for order {order_id}")
        except Exception as e:
            print(f"Warning: Failed to send ORDER.READY event: {str(e)}")
            # Don't fail the request if event sending fails
        
        return json_response({
            'message': f'Orden asignada a {driver} para entrega',
            'order': response['Attributes']
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada o no está en estado PACKED'}, 400)
        print(f"AWS ClientError in deliver: {repr(e)}")
        return json_response({'error': f'Error AWS en deliver: {code}'}, 500)
    except Exception as e:
        print(f"Error assigning delivery: {repr(e)}")
        return json_response({'error': f'Error interno en deliver: {type(e).__name__}: {str(e)}'}, 500)
