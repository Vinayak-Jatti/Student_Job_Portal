# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Setup Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/placement_portal
JWT_SECRET=your_secret_key_12345
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm start
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

### 3. Make Sure MongoDB is Running

**Local MongoDB:**
- Start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Or use MongoDB Atlas:**
- Update `MONGO_URI` in `backend/.env` with your Atlas connection string

### 4. Test the Application

1. Open `http://localhost:5173`
2. Register a new user
3. Login with your credentials
4. You'll be redirected to your role-specific dashboard

## ✅ Success Indicators

- Backend console shows: `✅ MongoDB connected` and `Server running on port 5000`
- Frontend opens at `http://localhost:5173`
- You can register and login successfully
- Dashboard loads with your role-specific view

## 🐛 Common Issues

**MongoDB not connecting?**
- Make sure MongoDB is installed and running
- Check your `MONGO_URI` in `backend/.env`

**CORS errors?**
- Verify `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Default is `http://localhost:5173`

**401 Unauthorized?**
- Make sure you're logged in
- Check that JWT_SECRET is set in `backend/.env`

For detailed setup instructions, see `SETUP_GUIDE.md`

