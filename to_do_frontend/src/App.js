import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { getTasks, createTask, updateTask, toggleTask, deleteTask } from './api';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

// PUBLIC_INTERFACE
function App() {
  /** Main App: manages tasks, filters, and calls API with optimistic updates. */
  const [theme, setTheme] = useState('light');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Initial load
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    getTasks()
      .then((data) => {
        if (!mounted) return;
        setTasks(Array.isArray(data) ? data : []);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e.message || 'Failed to load tasks');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.completed);
    if (filter === 'completed') return tasks.filter((t) => !!t.completed);
    return tasks;
  }, [tasks, filter]);

  const handleAdd = async (title) => {
    setBusy(true);
    setError('');
    // optimistic: add temporary task
    const tempId = `tmp-${Date.now()}`;
    const newTask = { id: tempId, title, completed: false };
    setTasks((prev) => [newTask, ...prev]);
    try {
      const created = await createTask(title);
      // replace temp with server task
      setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
    } catch (e) {
      // revert
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setError(e.message || 'Failed to add task');
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (id) => {
    setBusy(true);
    setError('');
    const prev = tasks;
    // optimistic toggle
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      // try dedicated toggle endpoint; if fails, fallback to PUT
      try {
        const updated = await toggleTask(id);
        setTasks((ts) => ts.map((t) => (t.id === id ? updated : t)));
      } catch {
        const current = tasks.find((t) => t.id === id);
        const updated = await updateTask(id, { completed: !current?.completed });
        setTasks((ts) => ts.map((t) => (t.id === id ? updated : t)));
      }
    } catch (e) {
      // revert
      setTasks(prev);
      setError(e.message || 'Failed to toggle task');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id) => {
    setBusy(true);
    setError('');
    const prev = tasks;
    // optimistic remove
    setTasks((ts) => ts.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (e) {
      // revert
      setTasks(prev);
      setError(e.message || 'Failed to delete task');
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = async (id, title) => {
    setBusy(true);
    setError('');
    const prev = tasks;
    // optimistic edit
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, title } : t)));
    try {
      const updated = await updateTask(id, { title });
      setTasks((ts) => ts.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      // revert
      setTasks(prev);
      setError(e.message || 'Failed to update task');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <div className="header-top">
            <h1 className="title">Tasks</h1>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          <TodoInput onAdd={handleAdd} disabled={busy} />

          <div className="filters">
            <button
              className={`filter ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>

          {error && <div className="alert error">{error}</div>}
          {loading ? (
            <div className="loading">Loading tasks…</div>
          ) : (
            <TodoList
              tasks={filteredTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              busy={busy}
            />
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
