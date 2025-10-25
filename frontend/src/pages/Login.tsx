
import React, { useState } from 'react';
import { loginUser, LoginResponse } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: LoginResponse = await loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="w-80 p-6 border rounded shadow">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border mb-2 p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border mb-4 p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">
          Login
        </button>
        <p className="mt-3 text-center text-sm">
          No account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
