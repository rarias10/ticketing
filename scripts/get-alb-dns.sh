#!/bin/bash

# Script to get ALB DNS name after deployment
echo "Getting ALB DNS name for GoDaddy configuration..."

# Get the NGINX ingress controller service
echo "Looking for NGINX LoadBalancer service..."
kubectl get svc -n ingress-nginx

# Get the specific LoadBalancer DNS name
ALB_DNS=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo ""
echo "🌐 Your ALB DNS Name:"
echo "================================"
echo "$ALB_DNS"
echo "================================"
echo ""
echo "📋 Use this DNS name to configure GoDaddy CNAME records"