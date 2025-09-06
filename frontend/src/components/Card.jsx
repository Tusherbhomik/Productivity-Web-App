import React, { useState } from 'react';
import { API_BASE_URL } from "../api";

export default function Card({ card, setCards, cards }) {
  const [resources, setResources] = useState(card.resources || []);
  // Debug: log resources to inspect data structure
  React.useEffect(() => {
    console.log('Card resources:', resources);
  }, [resources]);
  const [editTitle, setEditTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(card.title);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [addType, setAddType] = useState(null); // 'link' or 'note'
  const [newLink, setNewLink] = useState({ title: '', url: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Add Link
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newLink.title.trim() || !newLink.url.trim()) return;
    const token = localStorage.getItem('token');
    // Save as { type: 'link', content: url, title }
    const newResource = { type: 'link', title: newLink.title, content: newLink.url };
    const res = await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resources: [...resources, newResource] }),
    });
    const data = await res.json();
    setResources(data.resources);
    setCards(cards.map(c => c._id === card._id ? data : c));
    setNewLink({ title: '', url: '' });
    setShowAddMenu(false);
    setAddType(null);
  };

  // Add Note
  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    const token = localStorage.getItem('token');
    const newResource = { type: 'note', title: newNote.title, content: newNote.content };
    const res = await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ resources: [...resources, newResource] }),
    });
    const data = await res.json();
    setResources(data.resources);
    setCards(cards.map(c => c._id === card._id ? data : c));
    setNewNote({ title: '', content: '' });
    setShowAddMenu(false);
    setAddType(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md transition-shadow duration-200 flex flex-col w-full overflow-hidden border border-blue-100">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-blue-100 border-b border-blue-200">
        {editTitle ? (
          <form className="flex w-full" onSubmit={async e => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ title: titleValue, resources }),
            });
            if (res.ok) {
              setEditTitle(false);
              setCards(cards.map(c => c._id === card._id ? { ...c, title: titleValue } : c));
            }
          }}>
            <input className="border rounded p-1 flex-1 text-xs" value={titleValue} onChange={e => setTitleValue(e.target.value)} />
            <button className="ml-1 text-green-600 text-xs" type="submit">✔</button>
            <button className="ml-1 text-gray-600 text-xs" type="button" onClick={() => setEditTitle(false)}>✖</button>
          </form>
        ) : (
          <>
            <h3 className="font-bold text-base text-blue-900 flex-1">{card.title}</h3>
            <div className="flex gap-2 items-center">
              <button className="text-yellow-600 hover:text-yellow-700" title="Edit Card" onClick={() => setEditTitle(true)}>
                <span role="img" aria-label="Edit" className="text-xs">✏️</span>
              </button>
              <button className="text-red-600 hover:text-red-700" title="Delete Card" onClick={async () => {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
                  method: 'DELETE',
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  setCards(cards.filter(c => c._id !== card._id));
                }
              }}>
                <span role="img" aria-label="Delete" className="text-xs">🗑️</span>
              </button>
            </div>
          </>
        )}
      </div>
      {/* Render all resources in order, single column, small font */}
      <div className="px-3 py-2 space-y-2">
        {resources.map((r, i) => (
          <div key={i} className="bg-gray-50 rounded px-2 py-1 flex flex-col text-xs">
            {/* Link */}
            {r.type === 'link' && (
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-xs">{r.title}</span>
                  {/* Render links array if present, else render content as link */}
                  {Array.isArray(r.links) && r.links.length > 0 ? (
                    <div className="flex flex-col gap-1 mt-1">
                      {/* Show resource title above the links */}
                      {r.title && (
                        <span className="font-semibold text-xs mb-1">{r.title}</span>
                      )}
                      {r.links.filter(l => l.trim()).map((link, idx) => (
                        <a
                          key={idx}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 underline text-xs font-normal"
                          title={link}
                        >
                          {(() => {
                            try {
                              const url = new URL(link);
                              return url.hostname;
                            } catch {
                              return link;
                            }
                          })()}
                        </a>
                      ))}
                    </div>
                  ) : r.content ? (
                    <a
                      href={r.content}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 underline text-xs font-normal mt-1"
                      title={r.content}
                    >
                      {(() => {
                        try {
                          const url = new URL(r.content);
                          return url.hostname;
                        } catch {
                          return r.content;
                        }
                      })()}
                    </a>
                  ) : null}
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-yellow-600 hover:text-yellow-700"
                    title="Edit Link"
                    onClick={async () => {
                      const newTitle = prompt('Edit link title:', r.title || '');
                      const newUrl = prompt('Edit link URL:', r.content || (Array.isArray(r.links) && r.links[0]) || '');
                      if (newTitle !== null && newUrl !== null) {
                        const updated = resources.map((res, idx) => idx === i ? { ...res, title: newTitle, content: newUrl } : res);
                        setResources(updated);
                        // Update on server
                        const token = localStorage.getItem('token');
                        await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ resources: updated }),
                        });
                        setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
                      }
                    }}
                  ><span role="img" aria-label="Edit Resource" className="text-xs">✏️</span></button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    title="Delete Link"
                    onClick={async () => {
                      const updated = resources.filter((_, idx) => idx !== i);
                      setResources(updated);
                      // Update on server
                      const token = localStorage.getItem('token');
                      await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ resources: updated }),
                      });
                      setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
                    }}
                  ><span role="img" aria-label="Delete Resource" className="text-xs">🗑️</span></button>
                </div>
              </div>
            )}
            {/* Note */}
            {r.type === 'note' && (
              <div className="flex items-center justify-between">
                <div className="flex flex-col w-full">
                  <span className="font-semibold text-xs">{r.title || 'Note'}</span>
                  <div className="text-xs text-gray-700 max-h-24 overflow-y-auto whitespace-pre-line">{r.content}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="text-yellow-600 hover:text-yellow-700"
                    title="Edit Note"
                    onClick={async () => {
                      const newTitle = prompt('Edit note title:', r.title || '');
                      const newContent = prompt('Edit note content:', r.content || '');
                      if (newTitle !== null && newContent !== null) {
                        const updated = resources.map((res, idx) => idx === i ? { ...res, title: newTitle, content: newContent } : res);
                        setResources(updated);
                        // Update on server
                        const token = localStorage.getItem('token');
                        await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({ resources: updated }),
                        });
                        setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
                      }
                    }}
                  ><span role="img" aria-label="Edit Resource" className="text-xs">✏️</span></button>
                  <button
                    className="text-red-600 hover:text-red-700"
                    title="Delete Note"
                    onClick={async () => {
                      const updated = resources.filter((_, idx) => idx !== i);
                      setResources(updated);
                      // Update on server
                      const token = localStorage.getItem('token');
                      await fetch(`${API_BASE_URL}/api/cards/${card._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ resources: updated }),
                      });
                      setCards(cards.map(c => c._id === card._id ? { ...c, resources: updated } : c));
                    }}
                  ><span role="img" aria-label="Delete Resource" className="text-xs">🗑️</span></button>
                </div>
              </div>
            )}
            {/* Image */}
            {r.type === 'image' && r.content && (
              <div className="flex items-center justify-between">
                <img src={r.content} alt="resource" className="max-h-16 max-w-full rounded border mt-1" />
                <div className="flex gap-1">
                  <button className="text-yellow-600 hover:text-yellow-700" title="Edit Image" onClick={() => {/* ...existing code... */}}><span role="img" aria-label="Edit Resource" className="text-xs">✏️</span></button>
                  <button className="text-red-600 hover:text-red-700" title="Delete Image" onClick={() => {/* ...existing code... */}}><span role="img" aria-label="Delete Resource" className="text-xs">🗑️</span></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Footer: Add Resource Button */}
      <div className="px-3 py-2 bg-gray-100 flex flex-col items-center">
        {!showAddMenu ? (
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded font-semibold text-xs hover:bg-blue-600 transition-colors"
            onClick={() => setShowAddMenu(true)}
          >
            + Add resource
          </button>
        ) : (
          <div className="w-full max-w-xs bg-white border rounded shadow p-2 mt-2">
            <div className="flex flex-col gap-2">
              <button className="bg-blue-100 text-blue-900 px-2 py-1 rounded font-semibold text-xs hover:bg-blue-200" onClick={() => setAddType('link')}>Add Link</button>
              <button className="bg-green-100 text-green-900 px-2 py-1 rounded font-semibold text-xs hover:bg-green-200" onClick={() => setAddType('note')}>Add Text Note</button>
              <button className="text-gray-500 underline mt-1 text-xs" onClick={() => { setShowAddMenu(false); setAddType(null); }}>Cancel</button>
            </div>
            {/* Add Link Form */}
            {addType === 'link' && (
              <form className="mt-2 flex flex-col gap-1" onSubmit={handleAddLink}>
                <input className="border rounded p-1 text-xs" type="text" placeholder="Link Title" value={newLink.title} onChange={e => setNewLink({ ...newLink, title: e.target.value })} />
                <input className="border rounded p-1 text-xs" type="url" placeholder="URL" value={newLink.url} onChange={e => setNewLink({ ...newLink, url: e.target.value })} />
                <div className="flex gap-1 mt-1">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded font-semibold text-xs hover:bg-blue-600" type="submit">Add Link</button>
                  <button className="text-gray-500 underline text-xs" type="button" onClick={() => { setAddType(null); setNewLink({ title: '', url: '' }); }}>Cancel</button>
                </div>
              </form>
            )}
            {/* Add Note Form */}
            {addType === 'note' && (
              <form className="mt-2 flex flex-col gap-1" onSubmit={handleAddNote}>
                <input className="border rounded p-1 text-xs" type="text" placeholder="Note Title" value={newNote.title} onChange={e => setNewNote({ ...newNote, title: e.target.value })} />
                <textarea className="border rounded p-1 text-xs min-h-[40px]" placeholder="Note Content" value={newNote.content} onChange={e => setNewNote({ ...newNote, content: e.target.value })} />
                <div className="flex gap-1 mt-1">
                  <button className="bg-green-500 text-white px-2 py-1 rounded font-semibold text-xs hover:bg-green-600" type="submit">Add Note</button>
                  <button className="text-gray-500 underline text-xs" type="button" onClick={() => { setAddType(null); setNewNote({ title: '', content: '' }); }}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
