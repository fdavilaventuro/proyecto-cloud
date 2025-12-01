import json
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

    # Para ambiente académico: validar email y opcionalmente password
    email = body.get('email')
    password = body.get('password')  # no se valida contra DB en demo
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email es requerido'})
        }

    # Emitir token con claims básicos
    token = create_token(user_id=email, claims={'email': email})
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Login exitoso', 'token': token})
    }

import json
from common.response import json_response

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))
    username = body.get('username')
    password = body.get('password')
    if username == 'demo' and password == 'demo':
        return json_response({'token': 'demo-token', 'user': {'username': 'demo'}})
    return json_response({'error': 'Credenciales invalidas'}, status=401)
