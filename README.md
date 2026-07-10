# 🏠 Estate Hub — MERN Real Estate Platform

A full-stack real estate listing platform built with the MERN stack (MongoDB, Express, React, Node.js). Users can browse, search, and filter property listings, sign up or sign in (including Google OAuth), create and manage their own listings with image uploads, and contact landlords directly.

**Live Demo:** [estate-hubclient.vercel.app](https://estate-hubclient.vercel.app/)
**API:** [estate-hubapi.vercel.app](https://estate-hubapi.vercel.app/)


## ✨ Features

- 🔐 Authentication via email/password and Google OAuth (Firebase)
- 🏘️ Create, update, and delete property listings
- 🖼️ Multi-image upload per listing via Cloudinary
- 🔎 Search and filter by type, price, amenities (parking, furnished), and offers
- 📄 Detailed listing pages with an image carousel
- 📬 Contact landlord form (mailto-based)
- 👤 User profile management with avatar upload
- 📱 Fully responsive design with Tailwind CSS



## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Redux Toolkit + Redux Persist, Tailwind CSS, Swiper, Firebase Auth <br>
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication, bcryptjs<br>
**Image hosting:** Cloudinary<br>
**Deployment:** Vercel (frontend + backend as separate projects)<br>



## 📁 Project Structure

```
├── api/                    # Express backend
│   ├── controllers/        # Route handlers
│   ├── routes/              # API route definitions
│   ├── models/              # Mongoose schemas
│   ├── utils/                # Helpers (JWT verification, error handling)
│   ├── DB/                   # MongoDB connection logic
│   └── index.js              # App entry point
│
└── client/                 # React frontend
    └── src/
        ├── components/       # Reusable UI components
        ├── pages/             # Route-level pages
        ├── redux/             # Redux store & slices
        └── firebase.js        # Firebase config
```


## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A free [Firebase](https://console.firebase.google.com) project
- A free [Cloudinary](https://cloudinary.com) account

### 1. Clone the repo
```bash
git clone https://github.com/codingwithriha/MERN-Estate.git
cd MERN-Estate
```

### 2. Install dependencies
```bash
cd api && npm install
cd ../client && npm install
```

### 3. Set up environment variables

**`api/.env`**
```env
MONGO=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
NODE_ENV=development
```

**`client/.env`**
```env
VITE_API_URL=http://localhost:3000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

> Get your Firebase values from **Project Settings → General → Your apps**, enable **Authentication → Google sign-in**, and enable **Realtime Database**.
> Get your Cloudinary values from your dashboard, and create an **unsigned** upload preset under **Settings → Upload**.

### 4. Run the app
```bash
# Terminal 1 (backend)
cd api
npm run dev

# Terminal 2 (frontend)
cd client
npm run dev
```

The app will be running at `http://localhost:5173`, with the API on `http://localhost:3000`.


## ☁️ Deployment

This project deploys as **two separate Vercel projects**:

1. **Backend** set root directory to `api`, add `MONGO`, `JWT_SECRET`, and `NODE_ENV=production` as environment variables.
2. **Frontend** set root directory to `client`, add all `VITE_*` environment variables (pointing `VITE_API_URL` at your deployed backend URL).

After deploying:
- Add your frontend's deployed domain to **Firebase → Authentication → Settings → Authorized domains** (or Google sign-in will fail with `auth/unauthorized-domain`).
- Update the `origin` array in `api/index.js` to include your deployed frontend domain (or requests will be blocked by CORS).
- Redeploy the frontend after any environment variable change — Vite bakes `VITE_*` values in at build time.


## 🔑 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/signin` | Sign in with email/password |
| POST | `/api/auth/google` | Sign in/up via Google |
| GET | `/api/auth/signout` | Sign out |
| GET | `/api/user/:id` | Get user profile |
| POST | `/api/user/update/:id` | Update user profile |
| DELETE | `/api/user/delete/:id` | Delete user account |
| GET | `/api/user/listings/:id` | Get a user's listings |
| GET | `/api/user/contact/:id` | Get landlord contact info |
| POST | `/api/listing/create` | Create a listing |
| POST | `/api/listing/update/:id` | Update a listing |
| DELETE | `/api/listing/delete/:id` | Delete a listing |
| GET | `/api/listing/get/:id` | Get a single listing |
| GET | `/api/listing/get` | Search/filter listings |


## 📝 License

This project is open source and available for learning purposes.
