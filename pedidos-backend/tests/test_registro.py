import json
import sys
import os
from unittest.mock import MagicMock, patch

# Ensure the parent folder (pedidos-backend) is on sys.path so we can import lambdas
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Mock boto3 BEFORE importing the lambda (which imports common.db which creates a dynamodb resource)
with patch('boto3.resource') as mock_boto3_resource, \
     patch('boto3.client') as mock_boto3_client, \
     patch.dict(os.environ, {'PEDIDOS_TABLE': 'test-table', 'SQS_QUEUE': 'test-queue'}):
    
    mock_table = MagicMock()
    mock_boto3_resource.return_value.Table.return_value = mock_table
    
    import lambdas.pedidos.registro as registro


def test_registro_happy_path():
    # Prepare mocks
    mock_table = MagicMock()
    mock_table.put_item = MagicMock()

    # Patch pedidos_table to return our mock
    with patch('lambdas.pedidos.registro.pedidos_table', return_value=mock_table):
        # Mock SQS queue and sqs resource
        mock_queue = MagicMock()
        mock_queue.send_message = MagicMock()
        
        # Patch environment variables and sqs
        with patch.dict(os.environ, {'SQS_QUEUE': 'test-queue'}):
            with patch('lambdas.pedidos.registro.sqs') as mock_sqs:
                mock_sqs.get_queue_by_name.return_value = mock_queue
                
                # Create event
                body = {
                    'storeId': 'S1',
                    'client': 'Test User',
                    'address': '123 Main',
                    'total': 10.0,
                    'items': [{'productId': 'P1', 'qty': 1, 'price': 10.0}]
                }
                event = {'body': json.dumps(body)}

                resp = registro.lambda_handler(event, None)
                assert resp['statusCode'] == 200
                data = json.loads(resp['body'])
                assert 'orderId' in data
                mock_table.put_item.assert_called()
                mock_queue.send_message.assert_called()
