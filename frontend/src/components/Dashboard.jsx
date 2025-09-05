import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ContentPanel from './ContentPanel';

export default function Dashboard({ user, setUser }) {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
      if (data.length > 0) setActiveCategory(data[0]._id);
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        categories={categories}
        setCategories={setCategories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Logout</button>
        </header>
        <ContentPanel activeCategory={activeCategory} />
      </div>
    </div>
  );
}
