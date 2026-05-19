# PulseCRM — Sales Lead Management System

A full-stack CRM application built for small sales teams to manage leads, track pipeline progress, add activity notes, and view a real-time dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + Inline Styles |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Authentication | JWT + bcryptjs |
| HTTP Client | Axios |
| Icons | Lucide React |

---

## Features

- **Authentication** — JWT-based login with protected routes
- **Lead Management** — Full CRUD: create, view, edit, delete leads
- **Lead Status Tracking** — New, Contacted, Qualified, Proposal Sent, Won, Lost
- **Activity Notes** — Log calls, emails, and meeting updates per lead
- **Dashboard** — Live stats: total leads, qualified, won deals, revenue, pipeline breakdown
- **Search & Filtering** — Filter by status, source, salesperson; search by name, company, email
- **Dark UI** — Premium dark theme with violet accents (PulseCRM design)

---

## Project Structure

```
crm-app/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/      # Layout, LeadModal, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # useAuth
│   │   ├── lib/             # api.js, utils.js
│   │   └── pages/           # Login, Dashboard, Leads, LeadDetail
│   └── .env
└── server/                  # Node.js + Express backend
    ├── prisma/
    │   ├── schema.prisma    # Database schema
    │   └── seed.js          # Test user seed
    ├── src/
    │   ├── middleware/      # JWT auth middleware
    │   ├── routes/          # auth, leads, dashboard
    │   └── index.js         # Express entry point
    └── .env
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [PostgreSQL](https://www.postgresql.org/) v14 or higher
- npm v9 or higher

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/crm-app.git
cd crm-app
```

### 2. Set up the database

Open PostgreSQL and create the database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE crm_db;
\q
```

### 3. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/crm_db"
JWT_SECRET="supersecretjwtkey123"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

> Replace `YOUR_PASSWORD` with your PostgreSQL password.

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Seed the test user:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### 4. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Test Login Credentials

| Field | Value |
|---|---|
| Email | admin@example.com |
| Password | password123 |

---

## Database Setup

The database uses three tables:

| Table | Description |
|---|---|
| `User` | Stores login accounts |
| `Lead` | Stores all lead information |
| `Note` | Stores activity notes linked to leads |

**Run migrations:**
```bash
cd server
npx prisma migrate dev --name init
```

**Seed test user:**
```bash
npm run seed
```

**View database (Prisma Studio):**
```bash
npx prisma studio
```
Opens at `http://localhost:5555`

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:pass@localhost:5432/crm_db` |
| `JWT_SECRET` | Secret key for JWT signing | `supersecretjwtkey123` |
| `PORT` | Port for Express server | `5000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

> Never commit `.env` files to GitHub. They are listed in `.gitignore`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email + password |
| GET | `/api/auth/me` | Get current user |

### Leads
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/leads` | Get all leads (supports filters) |
| GET | `/api/leads/:id` | Get single lead with notes |
| POST | `/api/leads` | Create new lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| POST | `/api/leads/:id/notes` | Add note to lead |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Get pipeline stats |

> All endpoints except `/api/auth/login` require a `Bearer` token in the `Authorization` header.

---

## Demo Video

[Watch Demo](https://your-demo-link-here.com)

---

## Deployed Application

[Live App](https://your-deployed-app-link.com)

> Test credentials: `admin@example.com` / `password123`

---

## Known Limitations

- Single user account (no user registration flow)
- No role-based access control (all users see all leads)
- No email notifications or reminders
- No file attachments on leads or notes
- Mobile layout not fully optimised

---

## Reflection

Building this CRM from scratch helped me understand how real sales tools are structured end to end. The most challenging part was setting up Prisma with PostgreSQL and handling JWT authentication correctly — especially protecting routes on both the frontend and backend simultaneously.

I learned how to structure a REST API cleanly with Express, how Prisma migrations work in practice, and how to manage global auth state in React with Context. Debugging CORS issues between the frontend and backend was a good lesson in how full-stack communication works.

If I had more time I would add role-based permissions, email reminders for follow-ups, a Kanban pipeline view, and CSV export for leads.

---

## Scripts Reference

### Server
```bash
npm run dev      # Start with nodemon (development)
npm run start    # Start without nodemon (production)
npm run seed     # Seed test user to database
```

### Client
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```
