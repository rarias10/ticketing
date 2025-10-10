#!/bin/bash

echo "🔍 Finding all load balancers for kubevpro cluster..."
echo ""

echo "1. AWS ELB Load Balancers:"
aws elb describe-load-balancers --region us-east-2 --query 'LoadBalancerDescriptions[?contains(LoadBalancerName, `kubevpro`)].[LoadBalancerName,DNSName]' --output table

echo ""
echo "2. AWS ALB/NLB Load Balancers:"
aws elbv2 describe-load-balancers --region us-east-2 --query 'LoadBalancers[?contains(DNSName, `kubevpro`)].[LoadBalancerName,DNSName]' --output table

echo ""
echo "3. Kubernetes Services with External IPs:"
if kubectl cluster-info &>/dev/null; then
    kubectl get svc --all-namespaces --field-selector spec.type=LoadBalancer -o custom-columns="NAMESPACE:.metadata.namespace,NAME:.metadata.name,EXTERNAL-IP:.status.loadBalancer.ingress[0].hostname"
else
    echo "⚠️  kubectl not connected to cluster yet"
fi

echo ""
echo "4. Ingress Resources:"
if kubectl cluster-info &>/dev/null; then
    kubectl get ingress --all-namespaces -o custom-columns="NAMESPACE:.metadata.namespace,NAME:.metadata.name,HOSTS:.spec.rules[*].host,ADDRESS:.status.loadBalancer.ingress[0].hostname"
else
    echo "⚠️  kubectl not connected to cluster yet"
fi