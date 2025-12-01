import json
import uuid
from common.token import create_token


def lambda_handler(event, context):
    body = {}
    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Body inválido: debe ser JSON'})
        }

    # Campos básicos de registro (simples para entorno académico)
    name = body.get('name') or body.get('client') or 'Usuario'
    email = body.get('email')
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email es requerido'})
        }

    user_id = f'user-{uuid.uuid4().hex[:8]}'
    token = create_token(user_id, claims={'email': email, 'name': name})

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Registro exitoso', 'userId': user_id, 'token': token})
    }

import json
from common.response import json_response

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    # En un caso real: validar, hashear password, guardar en Users DynamoDB
    if not body.get('username'):
        return json_response({'error': 'username es requerido'}, status=400)
    return json_response({'message': 'Usuario registrado (mock)', 'user': {'username': body.get('username')}})
