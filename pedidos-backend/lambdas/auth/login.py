import json
import os
import boto3
from passlib.hash import pbkdf2_sha256
from common.token import create_token

dynamodb = boto3.resource('dynamodb')


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

    # Validar campos requeridos
    email = body.get('email')
    password = body.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email y password son requeridos'})
        }

    table = dynamodb.Table(os.environ.get('USERS_TABLE'))
    
    # Buscar usuario por email
    try:
        response = table.query(
            IndexName='EmailIndex',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        items = response.get('Items', [])
        if not items:
            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Credenciales inválidas'})
            }
        
        user = items[0]
    except Exception as e:
        print(f'Error querying user: {repr(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Error al buscar usuario'})
        }

    # Verificar password
    password_hash = user.get('passwordHash', '')
    if not pbkdf2_sha256.verify(password, password_hash):
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Credenciales inválidas'})
        }

    # Emitir token JWT
    token = create_token(
        user_id=user['userId'],
        claims={'email': user['email'], 'name': user.get('name', 'Usuario')}
    )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({
            'message': 'Login exitoso',
            'token': token,
            'userId': user['userId'],
            'name': user.get('name', 'Usuario')
        })
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
