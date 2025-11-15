# DAsh — Full Stack Notes Application

A minimal full-stack notes app built for an assessment.  
Frontend: **Next.js + Tailwind + TypeScript**, backend: **FastAPI + Motor (MongoDB)**, containerized via **Docker Compose**. Auth uses **JWT** (JSON Web Tokens). Local dev also supported without Docker.

---

## Quick summary

- Frontend (UI): `http://localhost:3000`  
- Backend (API): `http://localhost:8000` (Swagger docs: `/docs`)  
- Start both locally (recommended) with Docker Compose or run them separately in two terminals.

---

## Repository layout

```

/frontend        # Next.js app
/backend         # FastAPI app
/docker-compose.yml  # starts backend + mongo (and optionally frontend if configured)
README.md
screenshots/
.env.example (not committed secrets)

````

---

## Before you start

1. Install Docker Desktop (recommended) OR ensure you have:
   - Node.js and npm
   - Python 3.11+ and pip
   - MongoDB (or let Docker run it)
2. Do **not** commit `.env` with secrets. Use `.env.example` as a template.

---

## Option A — Run with Docker (recommended for reviewers)

This starts MongoDB + backend easily and keeps environment consistent.

### 1) From the project root
```bash
docker-compose up --build
````

* This command builds the backend image (if needed) and starts services.
* Leave this terminal open — Docker prints logs here. You can stop with `Ctrl+C` then `docker-compose down`.

### 2) Where to look

* Backend logs: the terminal running `docker-compose up` — watch for `Uvicorn` log showing `Application startup complete`.
* API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
* Frontend: if your compose includes frontend, it will run. If not, start frontend separately (see below).

---

## Option B — Run backend and frontend separately (two terminals)

You will open **two separate terminal windows/tabs**:

* **Terminal A** — Backend (FastAPI + MongoDB)
* **Terminal B** — Frontend (Next.js)

You must run both; the app needs the API and the web UI.

### Terminal A — Start backend (method 1, Docker for DB + manual backend)

If you use Docker only for MongoDB:

```bash
# from project root
docker-compose up -d mongo
# then run backend manually:
cd backend
python -m venv .venv
# Linux / WSL:
source .venv/bin/activate
# Windows PowerShell:
# .venv\Scripts\Activate.ps1
pip install -r requirements.txt

# copy example env and edit backend/.env if needed
cp backend/.env.example backend/.env
# then run backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

OR run everything with compose:

```bash
docker-compose up --build
```

(If you use compose, you don’t need to run `uvicorn` manually — the container runs it.)

### Terminal B — Start frontend

```bash
cd frontend
# create .env.local from example if provided:
cp .env.local.example .env.local
# install deps (first time)
npm install
# run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Two-terminal explanation (why two terminals?)

* The backend server (Uvicorn/FastAPI) is a running process that listens on port 8000 — Terminal A runs and shows backend logs, errors, and API output.
* The frontend dev server (Next.js) runs in Terminal B and serves the web UI on port 3000, shows compilation status, and hot-reloads on code change.
* Running both simultaneously allows you to see frontend requests and backend responses live and debug cross-service issues easily.

---

## Environment variables

### `backend/.env.example`

```ini
SECRET_KEY=changeme_replace_this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
MONGO_URI=mongodb://mongo:27017
DB_NAME=dashdb
```

### `frontend/.env.local.example`

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

**Important:** copy example files to actual `.env`/`.env.local` locally. **Never commit** `.env` to GitHub.

---

## How the pieces talk to each other

1. Frontend (browser) sends REST requests to backend at `http://localhost:8000`.
2. Auth flow:

   * Register: POST `/auth/register` -> backend stores hashed password in MongoDB.
   * Login: POST `/auth/login` -> backend validates password and returns a JWT `access_token`.
3. Frontend stores the JWT in `localStorage` (key: `notes_token`) and sets it in Axios headers for subsequent requests:

   ```
   Authorization: Bearer <JWT>
   ```
4. Backend validates the token on protected endpoints (notes CRUD) and uses `sub` (user id) claim to scope data.

---

## Quick manual test (verify both running)

### 1. Health check

* Backend: open [http://localhost:8000/docs](http://localhost:8000/docs) — Swagger UI should load.
* Frontend: open [http://localhost:3000](http://localhost:3000) — homepage should load.

### 2. Test register/login using curl (or Postman)

Register:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"secret123"}'
```

Login:

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"secret123"}'
```

You should receive JSON with `access_token`. Copy it for the next step.

### 3. Protected request (create note)

```bash
curl -X POST http://localhost:8000/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title":"Hello","content":"Test note"}'
```

Expect a JSON object for the created note.

---

## What to do after login in the UI (end-to-end flow)

1. Register via UI → then Login.
2. After login the frontend stores the token in localStorage and sets the user in the app state.
3. Create a new note (frontend sends POST `/notes` with Authorization header).
4. List of notes is fetched from GET `/notes` and displayed.
5. Edit/delete flows use PUT `/notes/{id}` and DELETE `/notes/{id}`.

---

## How to inspect network & stored token (browser)

1. Open DevTools (F12).
2. Storage / Application → Local Storage → `http://localhost:3000`:

   * Check `notes_token` value (long JWT) and `notes_user` (JSON).
3. Network tab: click an API request, inspect **Request Headers** to confirm `Authorization: Bearer <token>` is present.

---

## Common issues & troubleshooting

* **Frontend shows build errors about Tailwind / postcss**:

  * Ensure `tailwindcss`, `postcss`, `autoprefixer` installed, `tailwind.config.js` exists, and `app/globals.css` starts with:

    ```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
  * If node_modules mismatched, try:

    ```bash
    rm -rf node_modules package-lock.json
    npm install
    npm run dev
    ```

* **Backend cannot connect to MongoDB**:

  * If using Docker Compose, ensure `mongo` service is `Up` (`docker-compose ps`).
  * If using local Mongo, verify `MONGO_URI` in `.env` is correct and Mongo is running.

* **CORS errors in browser console**:

  * Ensure backend allows `http://localhost:3000` in FastAPI CORS middleware:

    ```py
    app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:3000"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
    )
    ```

* **401 Unauthorized on protected endpoints**:

  * Verify the token is present in localStorage and the frontend is attaching it.
  * Confirm the backend and frontend clocks are roughly in sync (token expiry depends on time).

---

## Useful commands & logs

### See Docker containers

```bash
docker-compose ps
docker-compose logs backend --tail=200 -f
docker-compose logs mongo  --tail=200 -f
```

### Stop services

```bash
docker-compose down
# or
Ctrl+C in the terminal running docker-compose up
```

### Restart frontend

```bash
cd frontend
npm run dev
```

### Restart backend (manual)

```bash
# if using uvicorn
# stop the process and run again:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Screenshots to include (place in `/screenshots` folder)

* `homepage.png` — Landing page with quote + Login/Sign Up
* `login.png` — Login page
* `register.png` — Register page
* `notes-dashboard.png` — Notes list after login
* `create-note.png` — Create note form
* `edit-note.png` — Edit note form (optional)

Commit and push `screenshots/` to GitHub so images render in README.

---

## Preparing repo for public submission

1. Add `.env.example` files (do not commit real `.env`).
2. Ensure `.gitignore` contains `backend/.env`, `frontend/.env.local`, `node_modules/`, `.venv/`, etc.
3. Test `docker-compose up --build` on a fresh clone (if possible).
4. Make repository **public** on GitHub when ready.

---

## Short explanation of JWT in this project (non-technical)

* After login, backend gives the frontend a signed token (JWT).
* The frontend stores this token locally and sends it with each API request.
* Backend checks the token to confirm who the user is before giving access to private data (notes).

---

## Final tips

* Keep two terminals open while developing — one for backend logs (errors), one for frontend (build/hmr).
* If something fails, copy the last error lines from each terminal and paste here and I’ll help debug.
* Create a short submission PDF with screenshots and the GitHub link for HR (they requested both PDF + public GitHub link).

---


If you want I’ll also produce the `submission.md` and a one-click print-to-PDF layout that matches the README and includes screenshot placeholders. Which one next?
```
