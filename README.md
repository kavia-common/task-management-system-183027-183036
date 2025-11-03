# task-management-system-183027-183036

To-Do app frontend (React) configured to talk to the backend Tasks API provided by the SQLite db_visualizer service.

Quick start
- Initialize the SQLite DB
- Start the backend + Tasks API (PORT 4000)
- Start the React frontend (PORT 3000)

1) Initialize the SQLite database
From: task-management-system-183027-183037/to_do_db

- Run:
  python3 init_db.py

This creates myapp.db with a tasks table and example records and writes db_visualizer/sqlite.env with SQLITE_DB pointing at the database file.

2) Start the backend (db_visualizer + Tasks API) on port 4000
From: task-management-system-183027-183037/to_do_db/db_visualizer

- Ensure SQLITE_DB is set (use the generated env file):
  bash -c 'source sqlite.env && echo "SQLITE_DB=$SQLITE_DB"'

- Install dependencies (only once):
  npm install

- Start the server (listens on PORT 4000 by default):
  # Make sure environment is loaded in the same shell
  source sqlite.env
  PORT=4000 npm start

What this provides:
- Generic DB viewing API under /api/{db}/...
- A Tasks CRUD REST API for SQLite under:
  GET    /api/tasks
  POST   /api/tasks
  PUT    /api/tasks/:id
  PATCH  /api/tasks/:id/toggle
  DELETE /api/tasks/:id

3) Start the React frontend
From: task-management-system-183027-183036/to_do_frontend

Option A: Use CRA proxy (recommended for local dev)
- The app is configured with "proxy": "http://localhost:4000" in package.json
- This forwards frontend requests to /api/* to the backend on 4000
- Steps:
  npm install
  npm start
- Open http://localhost:3000

Option B: Use explicit API URL
- If you prefer not to use the CRA proxy or your backend is not on localhost:4000, start the frontend with:
  REACT_APP_API_URL=http://<backend-host>:<port>/api npm start

Notes
- The frontend uses fetch against:
  BASE_URL = process.env.REACT_APP_API_URL || '/api'
  With the proxy configured, '/api' is forwarded to http://localhost:4000/api.
- Ensure the backend is running before using the app so the initial task load succeeds.

Troubleshooting
- 404/Network error when loading tasks:
  - Confirm backend is running on port 4000
  - If not using proxy, export REACT_APP_API_URL to point at http://host:port/api
- Empty task list after init:
  - Re-run python3 init_db.py to seed sample tasks
- CORS issues:
  - The backend enables permissive CORS headers; ensure you are hitting the correct host/port.
