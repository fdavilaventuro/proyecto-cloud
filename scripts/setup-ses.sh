#!/usr/bin/env bash
#
# Setup Amazon SES for email notifications
# Run this once before deploying kfc-integraciones
#
set -e

REGION="${1:-us-east-1}"
EMAIL="fabio.davila@utec.edu.pe"

echo "Setting up Amazon SES for email notifications..."
echo "Region: $REGION"
echo "Email: $EMAIL"
echo ""

# Verify email identity
echo "1. Requesting email verification for $EMAIL..."
aws ses verify-email-identity --email-address "$EMAIL" --region "$REGION"

echo ""
echo "✅ Verification email sent to $EMAIL"
echo ""
echo "⚠️  IMPORTANT: Check your inbox and click the verification link"
echo "   You must verify the email before SES can send notifications"
echo ""
echo "To check verification status:"
echo "  aws ses get-identity-verification-attributes --identities $EMAIL --region $REGION"
echo ""
echo "Once verified, deploy with:"
echo "  bash scripts/deploy-all.sh dev $REGION"
