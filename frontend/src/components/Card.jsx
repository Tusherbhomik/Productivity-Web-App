import React, { useState } from 'react';

export default function Card({ card, setCards, cards }) {
  const [resources, setResources] = useState(card.resources || []);
  const [newResource, setNewResource] = useState({ type: 'note', content: '' });
  const [editTitle, setEditTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(card.title);

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newResource.content.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/cards/${card._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resources: [...resources, newResource] }),
    });
    const data = await res.json();
    setResources(data.resources);
    setCards(cards.map(c => c._id === card._id ? data : c));
    setNewResource({ type: 'note', content: '' });
  };

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col max-w-md">
      <div className="flex items-center mb-2">
        {editTitle ? (
          <form className="flex w-full" onSubmit={async e => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/cards/${card._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ title: titleValue, resources }),
            });
            if (res.ok) {
              setEditTitle(false);
              setCards(cards.map(c => c._id === card._id ? { ...c, title: titleValue } : c));
            }
          }}>
            <input className="border rounded p-1 flex-1" value={titleValue} onChange={e => setTitleValue(e.target.value)} />
            <button className="ml-1 text-green-600" type="submit">✔</button>
            <button className="ml-1 text-gray-600" type="button" onClick={() => setEditTitle(false)}>✖</button>
          </form>
        ) : (
          <>
            <h3 className="font-bold text-lg flex-1">{card.title}</h3>
            <button className="ml-2 text-yellow-600" onClick={() => setEditTitle(true)}>✏️</button>
            <button className="ml-2 text-red-600" onClick={async () => {
              const token = localStorage.getItem('token');
              const res = await fetch(`http://localhost:5000/api/cards/${card._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                setCards(cards.filter(c => c._id !== card._id));
              }
            }}>🗑️</button>
          </>
        )}
      </div>
      <ul className="mb-2">
        {resources.map((r, i) => (
          <li key={i} className="mb-2 flex items-start group bg-gray-50 rounded px-3 py-2 shadow-sm">
            <span className="font-semibold mr-2 capitalize min-w-[60px]">{r.type}:</span>
            <div className="flex-1">
              {r.type === 'link' ? (
                <a href={r.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{r.content}</a>
              ) : r.type === 'image' ? (
                <img src={r.content} alt="resource" className="max-h-32 max-w-full rounded border" />
              ) : (
                <span className="break-words whitespace-pre-line">{r.content}</span>
              )}
            </div>
            <div className="flex items-center ml-2">
              <button className="text-yellow-600 opacity-0 group-hover:opacity-100" onClick={() => {
                const newContent = prompt('Edit resource:', r.content);
                if (newContent !== null) {
                  const updated = resources.map((res, idx) => idx === i ? { ...res, content: newContent } : res);
                  setResources(updated);
                  // Update on server
                  const token = localStorage.getItem('token');
                  fetch(`http://localhost:5000/api/cards/${card._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ resources: updated, title: titleValue }),
                  });
                  setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
                }
              }}>✏️</button>
              <button className="ml-2 text-red-600 opacity-0 group-hover:opacity-100" onClick={() => {
                const updated = resources.filter((_, idx) => idx !== i);
                setResources(updated);
                // Update on server
                const token = localStorage.getItem('token');
                fetch(`http://localhost:5000/api/cards/${card._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ resources: updated, title: titleValue }),
                });
                setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
              }}>🗑️</button>
            </div>
          </li>
        ))}
      </ul>
      <form className="flex gap-2 mb-2 items-center" onSubmit={handleAddResource}>
        <select className="border rounded p-1 w-24" value={newResource.type} onChange={e => setNewResource({ ...newResource, type: e.target.value })}>
          <option value="note">Note</option>
          <option value="link">Link</option>
          <option value="image">Image</option>
        </select>
        <input className="border rounded p-1 w-48" type="text" placeholder="Add resource" value={newResource.content} onChange={e => setNewResource({ ...newResource, content: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">Add</button>
      </form>
    </div>
  );
}
