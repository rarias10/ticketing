# Ticketing Microservices Application

A microservices-based ticketing platform built with Node.js, React, and Kubernetes.

## Services
- **Auth Service**: User authentication and JWT management
- **Client**: Next.js frontend application

## Tech Stack
- Node.js/Express with TypeScript
- Next.js/React
- MongoDB
- Kubernetes
- Docker
- NGINX Ingress

## Setup
1. Install dependencies: `npm install` in each service
2. Start with Skaffold: `skaffold dev`
3. Access at: `http://ticketing.dev`

## Development
- Auth tests: `cd auth && npm test`
- Client dev: `cd client && npm run dev`
