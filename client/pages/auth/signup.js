import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const LABELS = {
  EMAIL_ADDRESS: 'Email Address',
  PASSWORD: 'Password'
};

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center">
      <div className="row justify-content-center w-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Create Account</h1>
              <form onSubmit={onSubmit}>
                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">{LABELS.EMAIL_ADDRESS}</label>
                  <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control" 
                    type="email" 
                    id="email" 
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">{LABELS.PASSWORD}</label>
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control" 
                    type="password" 
                    id="password" 
                    placeholder="Enter your password"
                  />
                </div>
                {errors}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}