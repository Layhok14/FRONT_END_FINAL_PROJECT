import React from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Register Page</h2>
      <p>Create a new account</p>
      <div>
        <Link to="/">Back to Login</Link>
      </div>
    </div>
  );
}
