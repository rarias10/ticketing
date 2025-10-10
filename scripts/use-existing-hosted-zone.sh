#!/bin/bash

# Use existing kubevpro.basquiat.app hosted zone

echo "Checking for existing hosted zone: kubevpro.basquiat.app..."

# Check if hosted zone exists
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='kubevpro.basquiat.app.'].[Id]" --output text | sed 's|/hostedzone/||')

if [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ No hosted zone found for kubevpro.basquiat.app"
    echo "Creating hosted zone..."
    aws route53 create-hosted-zone --name kubevpro.basquiat.app --caller-reference $(date +%s)
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='kubevpro.basquiat.app.'].[Id]" --output text | sed 's|/hostedzone/||')
fi

echo "✅ Found/Created hosted zone: $HOSTED_ZONE_ID"

# Get the name servers
echo ""
echo "Name servers for kubevpro.basquiat.app:"
aws route53 get-hosted-zone --id $HOSTED_ZONE_ID --query "DelegationSet.NameServers" --output table

echo ""
echo "💡 If needed, add these as NS records in GoDaddy for subdomain kubevpro.basquiat.app"
echo "   Name: kubevpro"
echo "   Type: NS" 
echo "   Value: [each nameserver above]"
echo ""

# Delete existing cluster (if needed)
echo "⚠️  Uncomment the line below if you want to delete the existing cluster first:"
echo "# kops delete cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357 --yes"
echo ""

# Create improved cluster using existing hosted zone
kops create cluster \
  --name=kubevpro.basquiat.app \
  --state=s3://kopsstate1357 \
  --zones=us-east-2a,us-east-2b,us-east-2c \
  --node-count=3 \
  --node-size=t3.medium \
  --control-plane-size=t3.medium \
  --control-plane-count=1 \
  --dns-zone=kubevpro.basquiat.app \
  --node-volume-size=20 \
  --control-plane-volume-size=20 \
  --ssh-public-key ~/.ssh/id_ed25519.pub \
  --networking=calico \
  --topology=public \
  --api-loadbalancer-type=public \
  --cloud=aws \
  --master-zones=us-east-2a

echo ""
echo "✅ Cluster configuration created successfully!"
echo ""
echo "Review configuration with:"
echo "kops edit cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357"
echo ""
echo "Deploy with:"
echo "kops update cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357 --yes"