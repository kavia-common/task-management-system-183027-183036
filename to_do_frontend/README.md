# To-Do Frontend (React)

This is a lightweight React UI for managing tasks. It integrates with a backend Tasks REST API exposed by the SQLite db_visualizer service.

How the frontend reaches the backend API
- The app uses: BASE_URL = process.env.REACT_APP_API_URL || '/api' (see src/api.js)
- We set a CRA proxy in package.json: "proxy": "http://localhost:4000"
- In development, requests to '/api/*' are forwarded to the backend on http://localhost:4000

Run steps

1) Ensure the backend is running on port 4000
- From task-management-system-183027-183037/to_do_db:
  python3 init_db.py
- From task-management-system-183027-183037/to_do_db/db_visualizer:
  npm install
  source sqlite.env
  PORT=4000 npm start

2) Start the frontend
- From this directory (task-management-system-183027-183036/to_do_frontend):
  npm install
  npm start
- Open http://localhost:3000

Alternative: specify API URL explicitly
- If your backend is on a different host/port or you do not use the CRA proxy, start with:
  REACT_APP_API_URL=http://<backend-host>:<port>/api npm start

Available scripts

- npm start
  Runs the app in development mode at http://localhost:3000

- npm test
  Launches the test runner in interactive watch mode

- npm run build
  Builds the app for production to the build folder

Notes / Troubleshooting
- If tasks fail to load, confirm the backend is running on 4000 or set REACT_APP_API_URL accordingly.
- The backend expects SQLITE_DB to be set. Use `source task-management-system-183027-183037/to_do_db/db_visualizer/sqlite.env` before starting the backend.
- CORS is enabled on the backend; using the CRA proxy is recommended for local dev.
