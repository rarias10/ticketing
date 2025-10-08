import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // Server-side request - use purchased domain
    return axios.create({
      baseURL: 'http://www.basquiat.app',
      headers: {
        Host: 'www.basquiat.app',
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