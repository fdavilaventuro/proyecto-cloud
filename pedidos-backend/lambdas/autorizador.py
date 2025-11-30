import json

def lambda_handler(event, context):
    print("Evento Autorizador:", json.dumps(event))

    # API Gateway passes the Authorization header value in authorizationToken
    token = event.get('authorizationToken', '')

    # Dev/testing backdoor: allow exact demo token for smoke tests consistently
    if token == 'Bearer demo-token':
        return {
            'principalId': 'user123',
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
            'context': {
                'user': 'demo-user'
            }
        }

    # TODO: implement real token verification (JWT/OAuth) here for non-demo use
    raise Exception('Unauthorized')
