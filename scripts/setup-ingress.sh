#!/bin/bash

echo "🌐 Getting AWS Load Balancer DNS name for GoDaddy configuration..."

# Check if NGINX Ingress Controller is running
echo "🔍 Checking NGINX Ingress Controller status..."
kubectl get pods -n ingress-nginx

# Get the Load Balancer DNS name
echo "📡 Retrieving Load Balancer DNS name..."
ALB_DNS=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

if [ -z "$ALB_DNS" ]; then
    echo "❌ Could not retrieve ALB DNS name. Checking service status..."
    kubectl get svc -n ingress-nginx
    echo ""
    echo "💡 If the EXTERNAL-IP shows <pending>, wait a few minutes for AWS to provision the Load Balancer"
    exit 1
fi

echo ""
echo "✅ Load Balancer DNS Retrieved!"
echo "=========================================="
echo "🌐 Your AWS Load Balancer DNS Name:"
echo "$ALB_DNS"
echo "=========================================="
echo ""
echo "📋 GoDaddy DNS Configuration:"
echo "1. Login to GoDaddy and go to DNS settings for basquiat.app"
echo "2. Create/Update these CNAME records:"
echo "   - Type: CNAME, Name: www, Value: $ALB_DNS, TTL: 600"
echo "   - Type: CNAME, Name: @, Value: $ALB_DNS, TTL: 600"
echo "3. Wait 5-10 minutes for DNS propagation"
echo "4. Test with: curl -H 'Host: www.basquiat.app' http://$ALB_DNS"
echo ""
echo "🔗 Your application will be available at: https://www.basquiat.app"