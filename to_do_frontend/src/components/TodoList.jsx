import React from 'react';
import TodoItem from './TodoItem';

// PUBLIC_INTERFACE
export default function TodoList({ tasks, onToggle, onDelete, onEdit, busy }) {
  /** Renders a list of TodoItem components. */
  if (!tasks.length) {
    return <div className="empty">No tasks found.</div>;
  }

  return (
    <ul className="todo-list">
      {tasks.map((t) => (
        <TodoItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          busy={busy}
        />
      ))}
    </ul>
  );
}
