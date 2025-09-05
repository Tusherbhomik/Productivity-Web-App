import React, { useState, useEffect } from 'react';
import Card from './Card';

export default function ContentPanel({ activeCategory }) {
  const [cards, setCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState('');

  useEffect(() => {
    if (!activeCategory) return;
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/cards/${activeCategory}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCards(data);
    };
    fetchCards();
  }, [activeCategory]);

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/cards/${activeCategory}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: newCardTitle }),
    });
    const data = await res.json();
    setCards([...cards, data]);
    setNewCardTitle('');
  };

  // TODO: Add drag-and-drop reordering logic

  return (
    <div className="p-6">
      <form className="mb-4" onSubmit={handleAddCard}>
        <input className="p-2 border rounded mr-2" type="text" placeholder="Add card" value={newCardTitle} onChange={e => setNewCardTitle(e.target.value)} />
        <button className="bg-blue-500 text-white py-2 px-4 rounded" type="submit">Add Card</button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <Card key={card._id} card={card} setCards={setCards} cards={cards} />
        ))}
      </div>
    </div>
  );
}
