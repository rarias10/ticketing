#!/bin/bash

# Improved Kops cluster configuration for ticketing application

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