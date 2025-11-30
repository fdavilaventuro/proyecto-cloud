#!/usr/bin/env bash
#
# Setup Amazon SES for email notifications
# Note: AWS Academy LabRole doesn't have ses:VerifyEmailIdentity permission,
# so verification must be done via AWS Console or requested from instructor.
#
set -e

REGION="${1:-us-east-1}"
EMAIL="fabio.davila@utec.edu.pe"

echo "⚠️  AWS Academy LabRole Limitation"
echo "=================================="
echo ""
echo "Your AWS Academy account (LabRole) doesn't have permission to verify SES emails via CLI."
echo ""
echo "Option 1: Verify via AWS Console (Recommended)"
echo "-----------------------------------------------"
echo "1. Go to: https://console.aws.amazon.com/ses/home?region=$REGION#verified-senders-email:"
echo "2. Click 'Verify a New Email Address'"
echo "3. Enter: $EMAIL"
echo "4. Click 'Verify This Email Address'"
echo "5. Check inbox and click verification link"
echo ""
echo "Option 2: Use SES Sandbox Mode (Testing Only)"
echo "----------------------------------------------"
echo "- SES is already in sandbox mode by default"
echo "- You can send emails from any verified address TO any verified address"
echo "- For testing: sender and recipient must both be verified"
echo ""
echo "Option 3: Request Production Access (For Real Deployment)"
echo "----------------------------------------------------------"
echo "- If you need to send to unverified emails (real customers)"
echo "- Go to SES Console > Account Dashboard > Request production access"
echo "- Fill out the form (requires AWS support ticket)"
echo ""
echo "Current Configuration:"
echo "- Sender: $EMAIL (needs verification)"
echo "- Recipient: $EMAIL (same address, only needs one verification)"
echo "- Region: $REGION"
echo ""
echo "Once verified, deploy with:"
echo "  bash scripts/deploy-all.sh dev $REGION"
