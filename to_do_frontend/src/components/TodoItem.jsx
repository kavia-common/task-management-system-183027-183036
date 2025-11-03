import React, { useState, useEffect, useRef } from 'react';

// PUBLIC_INTERFACE
export default function TodoItem({ task, onToggle, onDelete, onEdit, busy }) {
  /** A single todo item with inline editing, toggle complete, and delete. */
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    // keep value in sync when parent updates (e.g., after optimistic revert)
    setValue(task.title);
  }, [task.title]);

  const handleSave = () => {
    const trimmed = value.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(task.title);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo-item ${task.completed ? 'completed' : ''}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id)}
          disabled={busy}
        />
        <span className="checkmark" />
      </label>

      {isEditing ? (
        <input
          ref={inputRef}
          className="edit-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={busy}
          aria-label="Edit task title"
        />
      ) : (
        <span
          className="title"
          onDoubleClick={() => !busy && setIsEditing(true)}
          title="Double click to edit"
        >
          {task.title}
        </span>
      )}

      <div className="actions">
        {!isEditing && (
          <button
            className="btn-secondary"
            onClick={() => setIsEditing(true)}
            disabled={busy}
            aria-label="Edit task"
          >
            Edit
          </button>
        )}
        <button
          className="btn-danger"
          onClick={() => onDelete(task.id)}
          disabled={busy}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
