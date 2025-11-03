const BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Helper to handle JSON responses and throw for HTTP errors.
 */
async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const message = text || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

/**
 * Build URL with base and path.
 */
function url(path) {
  return `${BASE_URL}${path}`;
}

// PUBLIC_INTERFACE
export async function getTasks() {
  /** Fetch all tasks from the API. Returns an array of tasks. */
  const res = await fetch(url('/tasks'), { headers: { 'Accept': 'application/json' } });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function createTask(title) {
  /** Create a new task by title. Returns the created task object. */
  const res = await fetch(url('/tasks'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ title })
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function updateTask(id, data) {
  /** Update a task with given fields (e.g., { title, completed }). Returns the updated task. */
  const res = await fetch(url(`/tasks/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function toggleTask(id) {
  /** Toggle task completion. Returns the updated task. */
  const res = await fetch(url(`/tasks/${id}/toggle`), {
    method: 'PATCH',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(res);
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /** Delete a task by id. Returns null on success. */
  const res = await fetch(url(`/tasks/${id}`), {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(res);
}
