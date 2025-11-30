"""
Shared DynamoDB helper for kfc-workflow lambdas.
Reduces boto3 duplication across workflow functions.
"""
import os
import boto3

dynamodb = boto3.resource('dynamodb')
TABLE_NAME = os.environ.get('TABLE_NAME', 'Orders')

def get_table():
    """Returns the configured DynamoDB table resource."""
    return dynamodb.Table(TABLE_NAME)
