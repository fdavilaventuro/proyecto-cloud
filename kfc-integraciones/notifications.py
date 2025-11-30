"""
EventBridge notification handler for KFC orders.
Listens to ORDER.PAID and ORDER.READY events and sends email notifications via SES.

Future enhancements:
- Send SMS notifications (SNS)
- Push notifications to mobile app
- Update analytics/reporting systems
"""
import json
import boto3
import os
from datetime import datetime
from botocore.exceptions import ClientError

# AWS clients
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

# Configuration
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')
TABLE_NAME = os.environ.get('TABLE_NAME', 'Orders')

# Email templates for different event types
EMAIL_TEMPLATES = {
    "ORDER.PAID": {
        "subject": "✅ Payment Confirmed - KFC Order #{orderId}",
        "body": """Hello {client},

Your payment has been confirmed!

Order Details:
- Order ID: {orderId}
- Total: ${total}
- Address: {address}

Your order is now being prepared by our kitchen team.

We'll notify you when it's ready for pickup or delivery.

Thank you for choosing KFC!
"""
    },
    "ORDER.READY": {
        "subject": "🍗 Your KFC Order is Ready! - Order #{orderId}",
        "body": """Hello {client},

Great news! Your KFC order is ready!

Order Details:
- Order ID: {orderId}
- Status: Out for delivery
- Driver: {driver}

Your delicious food is on its way!

Thank you for choosing KFC!
"""
    }
}

def get_order_details(order_id):
    """Fetch order details from DynamoDB."""
    try:
        table = dynamodb.Table(TABLE_NAME)
        response = table.get_item(Key={'id': order_id})
        return response.get('Item')
    except Exception as e:
        print(f"Error fetching order {order_id}: {str(e)}")
        return None


def send_email_notification(recipient, subject, body):
    """
    Send notification via Amazon SNS email subscription.
    - SNS topic must have the recipient subscribed (protocol=email) and confirmed.
    - For academic project, we publish to a shared topic to deliver emails to subscribed testers.
    """
    if not SNS_TOPIC_ARN:
        print("❌ SNS_TOPIC_ARN not configured; cannot publish notifications")
        return False
    try:
        message = f"Subject: {subject}\n\n{body}"
        resp = sns.publish(
            TopicArn=SNS_TOPIC_ARN,
            Message=message,
            Subject=subject
        )
        print(f"✅ SNS notification published. MessageId: {resp.get('MessageId')}")
        return True
    except Exception as e:
        print(f"❌ Error publishing to SNS: {str(e)}")
        return False


def lambda_handler(event, context):
    """
    Handle EventBridge events for order notifications.
    Sends email notifications to customers via Amazon SES.
    """
    print("📧 Notification event received:", json.dumps(event))
    
    # Extract event details
    detail_type = event.get("detail-type", "")
    detail = event.get("detail", {})
    order_id = detail.get("orderId", "")
    
    if not order_id:
        print("⚠️  No orderId in event, skipping")
        return {"statusCode": 400, "body": "Missing orderId"}
    
    # Get email template
    template = EMAIL_TEMPLATES.get(detail_type)
    if not template:
        print(f"⚠️  Unknown event type: {detail_type}")
        return {"statusCode": 400, "body": f"Unknown event: {detail_type}"}
    
    print(f"🔔 Processing notification for order {order_id}: {detail_type}")
    
    # Fetch order details from DynamoDB
    order = get_order_details(order_id)
    if not order:
        print(f"❌ Order {order_id} not found in database")
        return {"statusCode": 404, "body": "Order not found"}
    
    # Extract order data for email template
    client_name = order.get('client', 'Customer')
    total = order.get('total', 0)
    address = order.get('address', 'N/A')
    driver = order.get('driver', 'Our delivery team')
    
    # SNS delivers to all confirmed email subscriptions on the topic
    # Recipient here is informational only
    recipient_email = detail.get('email', 'fabio.davila@utec.edu.pe')
    
    # Format email content
    subject = template['subject'].format(orderId=order_id)
    body = template['body'].format(
        client=client_name,
        orderId=order_id,
        total=total,
        address=address,
        driver=driver
    )
    
    # Send email
    success = send_email_notification(recipient_email, subject, body)
    
    status = "sent" if success else "failed"
    print(f"{'✅' if success else '❌'} Notification {status} for order {order_id}")
    
    return {
        "statusCode": 200 if success else 500,
        "body": json.dumps({
            "orderId": order_id,
            "event": detail_type,
            "recipient": recipient_email,
            "status": status
        })
    }
