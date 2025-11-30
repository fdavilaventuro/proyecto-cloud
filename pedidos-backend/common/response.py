import json
from decimal import Decimal


def _to_python(obj):
    if isinstance(obj, list):
        return [_to_python(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _to_python(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        # Convert DynamoDB Decimal to float for JSON
        return float(obj)
    return obj


def json_response(body, status=200):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(_to_python(body))
    }
