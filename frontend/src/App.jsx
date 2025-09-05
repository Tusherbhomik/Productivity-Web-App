import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // 'login' | 'signup' | 'dashboard'
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
            setView('dashboard');
          } else {
            setUser(null);
            setView('login');
          }
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setView('login');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (!user) {
    return view === 'login' ? (
      <Login setUser={setUser} setView={setView} />
    ) : (
      <Signup setUser={setUser} setView={setView} />
    );
  }
  return <Dashboard user={user} setUser={setUser} />;
//   return <h1>Hello</h1>;
}

export default App;
