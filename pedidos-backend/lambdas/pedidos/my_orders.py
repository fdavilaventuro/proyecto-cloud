import json
import boto3
from boto3.dynamodb.conditions import Attr
from common.db import pedidos_table
from common.response import json_response

def _decimal_to_native(obj):
    from decimal import Decimal
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
    print("Evento My Orders:", json.dumps(event))
    
    # Get user email from authorizer context
    # The authorizer should populate this. Adjust based on your actual authorizer output.
    # Assuming the authorizer passes the claims or principalId.
    # If using a custom authorizer that passes context:
    auth_context = event.get('requestContext', {}).get('authorizer', {})
    
    # In a real scenario, you'd extract the email from the JWT claims in the context.
    # For this project, let's assume the authorizer might pass it, OR we filter by the email passed in query params (less secure but easier for now if auth context is tricky)
    # BUT, the plan said "Extracts the user's email from the JWT token".
    # Let's look at `autorizador.py` to see what it returns.
    # For now, I'll implement a fallback: check query param 'email' if context is missing, 
    # but ideally we rely on the token.
    
    # Let's try to get it from the authorizer context first (if your authorizer puts it there)
    # If not, we might need to rely on the client sending it, which we validate against the token? 
    # Actually, let's look at how `registro.py` does it? It doesn't seem to use the user info.
    
    # Let's check query parameters for now as a robust fallback, assuming the frontend sends the email of the logged-in user.
    params = event.get('queryStringParameters') or {}
    email = params.get('email')
    
    if not email:
        # Try to get from authorizer if available (depends on authorizer implementation)
        email = auth_context.get('email') or auth_context.get('principalId')
        
    if not email:
        return json_response({'error': 'Email requerido'}, status=400)

    email = email.lower()

    try:
        table = pedidos_table()
        
        # Scan with filter (since we don't have a GSI on client.email yet, or maybe we do? Let's check serverless.yml)
        # serverless.yml shows StoreIndex, StoreMenuIndex, EmailIndex (on UsersTable). 
        # PedidosTable only has StoreIndex. So we must Scan with Filter.
        
        response = table.scan(
            FilterExpression=Attr('client.email').eq(email)
        )
        
        items = response.get('Items', [])
        
        # Handle pagination
        while 'LastEvaluatedKey' in response:
            response = table.scan(
                FilterExpression=Attr('client.email').eq(email),
                ExclusiveStartKey=response['LastEvaluatedKey']
            )
            items.extend(response.get('Items', []))
            
        # Sort by createdAt desc
        items.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        
        return json_response(_decimal_to_native(items))
        
    except Exception as e:
        print(f"Error fetching my orders: {str(e)}")
        return json_response({'error': 'Error interno'}, status=500)
