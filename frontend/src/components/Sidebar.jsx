import React, { useState } from 'react';

export default function Sidebar({ categories, setCategories, activeCategory, setActiveCategory }) {
  const [expanded, setExpanded] = useState(true);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newCategory }),
    });
    const data = await res.json();
    setCategories([...categories, data]);
    setNewCategory('');
  };

  return (
    <aside className="bg-white shadow h-full w-64 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-bold">Categories</span>
      </div>
      <form className="p-4" onSubmit={handleAddCategory}>
        <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Add category" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
        <button className="w-full bg-blue-500 text-white py-1 rounded" type="submit">Add</button>
      </form>
      <ul className="mt-2">
        {categories.map(cat => (
          <li key={cat._id} className="flex items-center group">
            {editCategoryId === cat._id ? (
              <form className="flex w-full" onSubmit={async e => {
                e.preventDefault();
                // Update category name
                const token = localStorage.getItem('token');
                const res = await fetch(`http://localhost:5000/api/categories/${cat._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ name: editCategoryName }),
                });
                if (res.ok) {
                  setCategories(categories.map(c => c._id === cat._id ? { ...c, name: editCategoryName } : c));
                  setEditCategoryId(null);
                }
              }}>
                <input className="border rounded p-1 flex-1" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                <button className="ml-1 text-green-600" type="submit">✔</button>
                <button className="ml-1 text-gray-600" type="button" onClick={() => setEditCategoryId(null)}>✖</button>
              </form>
            ) : (
              <>
                <button
                  className={`w-full text-left px-4 py-2 hover:bg-blue-100 ${activeCategory === cat._id ? 'bg-blue-200 font-bold' : ''}`}
                  onClick={() => setActiveCategory(cat._id)}
                >
                  {cat.name}
                </button>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition ml-2">
                  <button className="text-yellow-600" onClick={() => { setEditCategoryId(cat._id); setEditCategoryName(cat.name); }}>✏️</button>
                  <button className="text-red-600" onClick={async () => {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`http://localhost:5000/api/categories/${cat._id}`, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    if (res.ok) {
                      setCategories(categories.filter(c => c._id !== cat._id));
                      if (activeCategory === cat._id) setActiveCategory(categories[0]?._id || null);
                    }
                  }}>🗑️</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
