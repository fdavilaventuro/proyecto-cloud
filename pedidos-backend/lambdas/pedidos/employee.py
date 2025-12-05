import json
import os
import boto3
from botocore.exceptions import ClientError
from datetime import datetime
from common.db import pedidos_table
from common.response import json_response

# EventBridge client for sending notification events
events = boto3.client('events')
sf = boto3.client('stepfunctions')
EVENT_BUS = os.environ.get('EVENT_BUS', 'orders-bus')


def _resume_step_function(token, output):
    """Helper to resume Step Function execution using a task token."""
    if not token:
        print("No task token found, skipping Step Function resume.")
        return
    try:
        sf.send_task_success(taskToken=token, output=json.dumps(output))
        print(f"Step Function resumed with token {token[:10]}...")
    except Exception as e:
        print(f"Error resuming Step Function: {e}")


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
            ConditionExpression='attribute_exists(id)', # Removed strict status check to allow flexibility with SF
            ExpressionAttributeValues={
                ':status': 'KITCHEN_READY',
                ':now': datetime.now().isoformat()
            },
            ReturnValues='ALL_NEW'
        )
        
        attributes = response['Attributes']
        _resume_step_function(attributes.get('kitchenToken'), {'status': 'KITCHEN_READY', 'id': order_id})
        
        return json_response({
            'message': 'Orden marcada como lista en cocina',
            'order': attributes
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada'}, 400)
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
                ':now': datetime.now().isoformat()
            },
            ConditionExpression='attribute_exists(id)',
            ReturnValues='ALL_NEW'
        )
        
        attributes = response['Attributes']
        _resume_step_function(attributes.get('packingToken'), {'status': 'PACKED', 'id': order_id})
        
        return json_response({
            'message': 'Orden marcada como empacada',
            'order': attributes
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada'}, 400)
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
                ':now': datetime.now().isoformat()
            },
            ConditionExpression='attribute_exists(id)',
            ReturnValues='ALL_NEW'
        )
        
        attributes = response['Attributes']
        _resume_step_function(attributes.get('deliveryToken'), {'status': 'DELIVERING', 'id': order_id})
        
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
            'order': attributes
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada'}, 400)
        print(f"AWS ClientError in deliver: {repr(e)}")
        return json_response({'error': f'Error AWS en deliver: {code}'}, 500)
    except Exception as e:
        print(f"Error assigning delivery: {repr(e)}")
        return json_response({'error': f'Error interno en deliver: {type(e).__name__}: {str(e)}'}, 500)


def mark_delivered(event, context):
    """
    PUT /employee/order/{id}/delivered
    Driver marks order as delivered to customer.
    Sends ORDER.DELIVERED event (optional).
    """
    try:
        if 'pathParameters' not in event or 'id' not in event['pathParameters']:
            return json_response({'error': 'Parámetro de ruta faltante: {id}'}, 400)
        order_id = event['pathParameters']['id']
        
        table = pedidos_table()
        
        # Update status to DELIVERED
        response = table.update_item(
            Key={'id': order_id},
            UpdateExpression="SET #s = :status, deliveredAt = :now, updatedAt = :now",
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={
                ':status': 'DELIVERED',
                ':now': datetime.now().isoformat()
            },
            ConditionExpression='attribute_exists(id)',
            ReturnValues='ALL_NEW'
        )
        
        attributes = response['Attributes']
        _resume_step_function(attributes.get('finalDeliveryToken'), {'status': 'DELIVERED', 'id': order_id})
        
        return json_response({
            'message': 'Orden marcada como entregada',
            'order': attributes
        }, 200)
        
    except ClientError as e:
        code = e.response.get('Error', {}).get('Code')
        if code == 'ConditionalCheckFailedException':
            return json_response({'error': 'Orden no encontrada'}, 400)
        print(f"AWS ClientError in delivered: {repr(e)}")
        return json_response({'error': f'Error AWS en delivered: {code}'}, 500)
    except Exception as e:
        print(f"Error marking delivered: {repr(e)}")
        return json_response({'error': f'Error interno en delivered: {type(e).__name__}: {str(e)}'}, 500)


def get_orders(event, context):
    """
    GET /employee/orders
    Fetch all orders for the employee dashboard.
    """
    try:
        table = pedidos_table()
        
        # Scan table to get all orders (for now, optimization can be done later with query by status or date)
        response = table.scan()
        items = response.get('Items', [])
        
        # Handle pagination if necessary (for now just get first page)
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
            
        return json_response(items, 200)

    except ClientError as e:
        print(f"AWS ClientError in get_orders: {repr(e)}")
        return json_response({'error': f'Error AWS en get_orders: {e.response.get("Error", {}).get("Code")}'}, 500)
    except Exception as e:
        print(f"Error fetching orders: {repr(e)}")
        return json_response({'error': f'Error interno en get_orders: {type(e).__name__}: {str(e)}'}, 500)
