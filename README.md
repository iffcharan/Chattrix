# Chattrix

Chattrix is a full-stack communication platform built to demonstrate scalable frontend–backend architecture and real-time interaction concepts.

---

## Live Demo

🔗 **Demo:** https://chattrix-7wck.onrender.com/

---

## Project Overview

Chattrix is designed using a layered architecture:

- Frontend → User interface & interaction
- Backend → APIs and business logic
- Database → Data persistence

Key highlights:

- Full-stack architecture
- Modular folder structure
- Scalable backend design
- Real-time communication ready (WebSockets)

---

## 📂 Project Structure

Chattrix/
│
├── frontend/ # Client-side application
│ ├── src/ # Main source code
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page-level components
│ │ ├── services/ # API calls / integrations
│ │ └── App.js # Main app entry
│ │
│ └── package.json # Frontend dependencies
│
├── backend/ # Server-side application
│ ├── routes/ # API routes
│ ├── controllers/ # Business logic
│ ├── models/ # Database models
│ ├── config/ # Configuration files
│ └── server.js # Backend entry point
│
├── README.md
└── package.json



---

## ⚙️ Tech Stack

### Frontend
- React.js
- JavaScript
- CSS / daisyui

### Backend
- Node.js
- Express.js

### Database
- MongoDB 

### Tools
- Git & GitHub
- REST APIs
- WebSockets (getstream.io)

---

## 🏗️ Architecture (High Level)
User → Frontend UI → API / Socket Layer → Backend → Database



- REST APIs handle structured requests
- Socket connection handles real-time events
- Backend remains stateless for scalability

---

## ▶️ Running Locally

### 1️⃣ Clone Repository

```bash
git clone https://github.com/iffcharan/Chattrix.git
cd Chattrix

2️⃣ Install Dependencies

Frontend:

cd frontend
npm install

Backend:

cd backend
npm install
3️⃣ Start Application

Backend:

npm start

Frontend:

npm start
