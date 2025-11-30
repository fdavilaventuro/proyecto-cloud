"""
EventBridge notification handler for KFC orders.
Listens to ORDER.PAID and ORDER.READY events and logs them for future notification extensions.

Future enhancements:
- Send email notifications to customers (SES)
- Send SMS notifications (SNS)
- Push notifications to mobile app
- Update analytics/reporting systems
"""
import json
import boto3
import os
from datetime import datetime

# EventBridge event types we listen to
NOTIFICATION_EVENTS = {
    "ORDER.PAID": "Payment confirmed - order is being prepared",
    "ORDER.READY": "Order is ready for pickup or out for delivery"
}

def lambda_handler(event, context):
    """
    Handle EventBridge events for order notifications.
    Currently logs events; extend this function to send actual notifications.
    """
    print("📧 Notification event received:", json.dumps(event))
    
    # Extract event details
    detail_type = event.get("detail-type", "")
    detail = event.get("detail", {})
    order_id = detail.get("orderId", "")
    
    if not order_id:
        print("⚠️  No orderId in event, skipping")
        return {"statusCode": 400, "body": "Missing orderId"}
    
    # Log notification opportunity
    message = NOTIFICATION_EVENTS.get(detail_type, "Unknown event")
    print(f"🔔 Notification for order {order_id}: {detail_type}")
    print(f"   Message: {message}")
    
    # TODO: Implement actual notification sending here
    # Examples:
    # - Send email via SES: boto3.client('ses').send_email(...)
    # - Send SMS via SNS: boto3.client('sns').publish(PhoneNumber=..., Message=...)
    # - Push notification via FCM/APNS
    # - Store notification in DB for customer portal
    
    # For now, just log
    print(f"✅ Notification logged for order {order_id}")
    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "orderId": order_id,
            "event": detail_type,
            "message": message,
            "status": "logged"
        })
    }
