import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function TodoInput({ onAdd, disabled }) {
  /** Input bar to add new todos. Controlled locally and submits via onAdd(title). */
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || disabled) return;
    onAdd(trimmed);
    setTitle('');
  };

  return (
    <form className="todo-input" onSubmit={handleSubmit}>
      <input
        type="text"
        aria-label="Add a task"
        placeholder="Add a new task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="btn-primary" disabled={disabled || !title.trim()}>
        Add
      </button>
    </form>
  );
}
