# Datastraw Support CRM

A full-stack Customer Support CRM application built as a hiring assignment for Datastraw Technologies.

## 🚀 Tech Stack
- **Backend:** Node.js, Express
- **Database:** SQLite 
- **Frontend:** React, Vite, Tailwind CSS

## 📁 Folder Structure
- `backend/` - Node.js Express server and SQLite database setup.
- `frontend/` - React application styled with Tailwind CSS.

## ⚙️ Setup Instructions

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/datastraw-crm.git
cd datastraw-crm

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Run Locally

**Start the Backend (Terminal 1):**
```bash
cd backend
node server.js
```
*Server runs on http://localhost:5000*

**Start the Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```
*App runs on http://localhost:5173*

*(Note: The frontend uses a Vite proxy in development so API calls to `/api/...` are forwarded to the backend automatically).*

## 📡 API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/tickets` | Create a new ticket. Body: `{ customer_name, customer_email, subject, description }` |
| `GET` | `/api/tickets` | List all tickets. Optional query: `?status=Open&search=query` |
| `GET` | `/api/tickets/:ticket_id` | Get details and notes for one ticket. |
| `PUT` | `/api/tickets/:ticket_id` | Update status or add note. Body: `{ status }` or `{ note_text }` |

## 🌐 Deployment (Render)

**Backend:**
1. Create a "Web Service" pointing to the `backend` root folder.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Environment variables: `PORT=5000`

**Frontend:**
1. Create a "Static Site" pointing to the `frontend` root folder.
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Environment Variables: `VITE_API_URL=https://your-backend-url.onrender.com`
