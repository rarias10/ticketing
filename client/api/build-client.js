import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // Server-side request - use ingress controller
    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: {
        Host: 'ticketing.dev',
        ...req.headers
      }
    });
  } else {
    // Client-side request
    return axios.create({
      baseURL: '/'
    });
  }
};