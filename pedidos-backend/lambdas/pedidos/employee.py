"""
Employee-facing endpoints for manual order status updates.
These are called by the employee frontend to transition orders through kitchen, packing, and delivery stages.
"""
import json
import os
from datetime import datetime
from common.db import pedidos_table
from common.response import success_response, error_response


def mark_kitchen_ready(event, context):
    """
    PUT /employee/order/{id}/kitchen-ready
    Employee marks order as ready from kitchen.
    """
    try:
        order_id = event['pathParameters']['id']
        table = pedidos_table()
        
        # Update status to KITCHEN_READY
        response = table.update_item(
            Key={'id': order_id},
            UpdateExpression="SET #s = :status, updatedAt = :now",
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={
                ':status': 'KITCHEN_READY',
                ':now': datetime.now().isoformat()
            },
            ConditionExpression='attribute_exists(id) AND #s = :current_status',
            ExpressionAttributeValues={
                **{':status': 'KITCHEN_READY', ':now': datetime.now().isoformat()},
                ':current_status': 'PAID'  # Only allow transition from PAID
            },
            ReturnValues='ALL_NEW'
        )
        
        return success_response({
            'message': 'Orden marcada como lista en cocina',
            'order': response['Attributes']
        })
        
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return error_response('Orden no encontrada o no está en estado PAID', 400)
    except Exception as e:
        print(f"Error marking kitchen ready: {str(e)}")
        return error_response(f'Error interno: {str(e)}', 500)


def mark_packed(event, context):
    """
    PUT /employee/order/{id}/packed
    Employee marks order as packed and ready for pickup.
    """
    try:
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
        
        return success_response({
            'message': 'Orden marcada como empacada',
            'order': response['Attributes']
        })
        
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return error_response('Orden no encontrada o no está en estado KITCHEN_READY', 400)
    except Exception as e:
        print(f"Error marking packed: {str(e)}")
        return error_response(f'Error interno: {str(e)}', 500)


def assign_delivery(event, context):
    """
    PUT /employee/order/{id}/deliver
    Manager assigns driver and marks order as out for delivery.
    Body: {"driver": "Driver Name"}
    """
    try:
        order_id = event['pathParameters']['id']
        body = json.loads(event.get('body', '{}'))
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
        
        return success_response({
            'message': f'Orden asignada a {driver} para entrega',
            'order': response['Attributes']
        })
        
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return error_response('Orden no encontrada o no está en estado PACKED', 400)
    except Exception as e:
        print(f"Error assigning delivery: {str(e)}")
        return error_response(f'Error interno: {str(e)}', 500)
