# OpenNest 🪺
A full-stack **Reddit-style discussion platform** with **Instagram-like profiles**, built using the **MERN stack**.  
Users can create communities, share posts, engage in nested comment discussions, follow profiles, and upvote/downvote content.

---

## 🚀 Features
- **Authentication & Profiles**
  - User registration & login with JWT
  - Editable bio & profile avatar
  - Follow / unfollow users (Instagram-like)
- **Posts & Communities**
  - Create & join communities
  - Post text, links, and images
  - Browse posts by community or global feed
- **Nested Comments**
  - Infinite depth threaded comments
  - Recursive rendering for replies
- **Voting System**
  - Upvote / downvote posts & comments
  - Live score updates
- **Modern UI**
  - React + Vite frontend
  - TailwindCSS styling
  - Zustand for state management
  - Responsive, mobile-friendly design
- **Backend**
  - Express.js + MongoDB (Mongoose)
  - Secure password hashing with bcrypt
  - Modular routes & controllers
  - Error handling middleware

---

## 🛠️ Tech Stack
- **Frontend:** React (Vite), TailwindCSS, Zustand, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
- **Other:** Cloud-ready, REST API, CORS enabled

---

## 📂 Project Structure
opennest/
│── client/ # Frontend (React + Vite + Tailwind)
│── server/ # Backend (Express + MongoDB + JWT)
│── README.md
│── .gitignore


---

## ⚡ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/nitinpathekar/opennest.git
cd opennest
```

 # Setup the Backend
 ```
cd server
npm install
npm run dev

```
Server runs at: http://localhost:5000
# Setup the Frontend

```
cd ../client
cp .env.example .env
npm install
npm run dev

```


Frontend runs at: http://localhost:5173

# Environment Variables
Backend (server/.env)

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/opennest
CLIENT_URL=http://localhost:5173
```

Frontend (client/.env)
```
VITE_API_URL=http://localhost:5000/opennest
```
