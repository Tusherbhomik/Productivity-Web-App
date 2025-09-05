import React, { useState } from 'react';
import { API_BASE_URL } from "../api";

export default function Signup({ setUser, setView }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleSignup}>
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <input className="w-full mb-2 p-2 border rounded" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className="w-full mb-2 p-2 border rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full mb-4 p-2 border rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" type="submit">Sign Up</button>
        <div className="mt-2 text-sm text-center">
          Already have an account? <button type="button" className="text-blue-500 underline" onClick={() => setView('login')}>Login</button>
        </div>
      </form>
    </div>
  );
}
