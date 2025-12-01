import json
import re
from common.token import verify_token

def lambda_handler(event, context):
    print("Evento Autorizador:", json.dumps(event))

    # API Gateway passes the Authorization header value in authorizationToken
    token = event.get('authorizationToken', '')

    # Soportar autenticación con JWT en Authorization: Bearer <token>
    m = re.match(r'\s*Bearer\s+(.+)', token or '')
    if m:
        raw = m.group(1)
        try:
            payload = verify_token(raw)
            return {
                'principalId': payload.get('sub', 'user'),
                'policyDocument': {
                    'Version': '2012-10-17',
                    'Statement': [
                        {
                            'Action': 'execute-api:Invoke',
                            'Effect': 'Allow',
                            'Resource': event['methodArn']
                        }
                    ]
                },
                'context': {k: str(v) for k, v in payload.items()}
            }
        except Exception as e:
            print('Auth error:', repr(e))
            raise Exception('Unauthorized')

    raise Exception('Unauthorized')
