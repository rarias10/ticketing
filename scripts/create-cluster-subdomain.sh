#!/bin/bash

# Alternative: Use subdomain approach (no GoDaddy changes needed)

# Create Route53 hosted zone for a subdomain
echo "Creating Route53 hosted zone for k8s.basquiat.app..."
aws route53 create-hosted-zone --name k8s.basquiat.app --caller-reference $(date +%s) || echo "Hosted zone might already exist"

# Get the name servers
echo ""
echo "Getting name servers for k8s.basquiat.app hosted zone..."
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='k8s.basquiat.app.'].[Id]" --output text | sed 's|/hostedzone/||')
aws route53 get-hosted-zone --id $HOSTED_ZONE_ID --query "DelegationSet.NameServers" --output table

echo ""
echo "⚠️  Add these as NS records in GoDaddy for subdomain k8s.basquiat.app"
echo "   Or skip this step and use cluster without custom DNS"
echo ""

# Create cluster with subdomain
kops create cluster \
  --name=kubevpro.k8s.basquiat.app \
  --state=s3://kopsstate1357 \
  --zones=us-east-2a,us-east-2b,us-east-2c \
  --node-count=3 \
  --node-size=t3.medium \
  --control-plane-size=t3.medium \
  --control-plane-count=1 \
  --dns-zone=k8s.basquiat.app \
  --node-volume-size=20 \
  --control-plane-volume-size=20 \
  --ssh-public-key ~/.ssh/id_ed25519.pub \
  --networking=calico \
  --topology=public \
  --api-loadbalancer-type=public \
  --cloud=aws \
  --master-zones=us-east-2a

echo "Cluster configuration created. Review with:"
echo "kops edit cluster --name=kubevpro.k8s.basquiat.app --state=s3://kopsstate1357"
echo ""
echo "Deploy with:"
echo "kops update cluster --name=kubevpro.k8s.basquiat.app --state=s3://kopsstate1357 --yes"