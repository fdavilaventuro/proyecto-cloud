import json
import uuid
import os
import boto3
from datetime import datetime
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
    name = body.get('name') or 'Usuario'
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email y password son requeridos'})
        }

    table = dynamodb.Table(os.environ.get('USERS_TABLE'))
    
    # Verificar si el email ya existe
    try:
        response = table.query(
            IndexName='EmailIndex',
            KeyConditionExpression='email = :email',
            ExpressionAttributeValues={':email': email}
        )
        if response.get('Items'):
            return {
                'statusCode': 409,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'El email ya está registrado'})
            }
    except Exception as e:
        print(f'Error checking email: {repr(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Error al verificar email'})
        }

    # Hash password con passlib (pure Python)
    password_hash = pbkdf2_sha256.hash(password)
    
    # Crear usuario
    user_id = f'user-{uuid.uuid4().hex[:8]}'
    try:
        table.put_item(
            Item={
                'userId': user_id,
                'email': email,
                'name': name,
                'passwordHash': password_hash,
                'createdAt': datetime.now().isoformat()
            }
        )
    except Exception as e:
        print(f'Error creating user: {repr(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Error al crear usuario'})
        }

    # Emitir token JWT
    token = create_token(user_id, claims={'email': email, 'name': name})

    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Registro exitoso', 'userId': user_id, 'token': token})
    }
