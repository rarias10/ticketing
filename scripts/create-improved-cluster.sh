#!/bin/bash

# Improved Kops cluster configuration for ticketing application

# Step 1: Create Route53 hosted zone for DNS
echo "Creating Route53 hosted zone for basquiat.app..."
aws route53 create-hosted-zone --name basquiat.app --caller-reference $(date +%s) || echo "Hosted zone might already exist"

# Get the name servers (you'll need these for GoDaddy)
echo ""
echo "Getting name servers for basquiat.app hosted zone..."
aws route53 list-hosted-zones --query "HostedZones[?Name=='basquiat.app.'].[Id]" --output text | head -1 | xargs -I {} aws route53 get-hosted-zone --id {} --query "DelegationSet.NameServers" --output table

echo ""
echo "⚠️  IMPORTANT: You need to update your GoDaddy nameservers to the AWS nameservers shown above!"
echo "   Go to GoDaddy → Domain Settings → Nameservers → Use custom nameservers"
echo ""
read -p "Press Enter after updating nameservers in GoDaddy, or Ctrl+C to cancel..."

# Delete existing cluster (if needed)
# kops delete cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357 --yes

# Create improved cluster
kops create cluster \
  --name=kubevpro.basquiat.app \
  --state=s3://kopsstate1357 \
  --zones=us-east-2a,us-east-2b,us-east-2c \
  --node-count=3 \
  --node-size=t3.medium \
  --control-plane-size=t3.medium \
  --control-plane-count=1 \
  --dns-zone=basquiat.app \
  --node-volume-size=20 \
  --control-plane-volume-size=20 \
  --ssh-public-key ~/.ssh/id_ed25519.pub \
  --networking=calico \
  --topology=public \
  --api-loadbalancer-type=public \
  --cloud=aws \
  --master-zones=us-east-2a

echo "Cluster configuration created. Review with:"
echo "kops edit cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357"
echo ""
echo "Deploy with:"
echo "kops update cluster --name=kubevpro.basquiat.app --state=s3://kopsstate1357 --yes"