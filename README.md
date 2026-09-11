# TaskFlow - Project Management System

**TaskFlow** is a modern, production-grade, full-stack project management web application built with **React**, **Node.js + Express**, **Prisma ORM**, and **PostgreSQL**. It provides multi-tenant security, user-scoped metrics, real-time status tracking, JWT authentication, and interactive search and filtering.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Security
- User registration and login with bcrypt password hashing.
- State-of-the-art JWT authentication via HTTP Bearer headers.
- Protected API routes with strict user-isolation middleware.
- Input validation, email normalization, rate limiting (auth & API limiters), Helmet security headers, and CORS control.
- Safe error handling (passwords and internal stack traces never exposed in production responses).

### 2. 📁 Project Management
- Full CRUD operations for projects (Create, Read, Update, Delete).
- Project fields: Name, Description, Status (`Not Started`, `In Progress`, `Completed`), Start Date, End Date, and Creation Timestamp.
- Search projects by name with case-insensitive matching.
- Filter projects by status.
- Cascade deletion of associated tasks upon project removal.

### 3. 🎯 Task Management
- Associate tasks with specific projects and authenticated users.
- Task fields: Name, Description, Priority (`Low`, `Medium`, `High`), Status (`Pending`, `In Progress`, `Completed`), Due Date, and Creation Timestamp.
- Quick checkbox toggle for marking tasks as `Completed`.
- Filter tasks by status and priority.
- Search tasks by name.

### 4. 📊 User Metrics Dashboard
- Dynamic real-time metrics calculated exclusively from the authenticated user's data:
  - Total Projects
  - Projects In Progress
  - Total Tasks
  - Completed Tasks
  - Pending Tasks
- Recent Projects and Urgent/Upcoming Tasks summary widgets.

### 5. 🎨 Responsive & Premium UI
- Glassmorphism aesthetic with vibrant color gradients, card depth, and smooth transitions.
- Fully responsive layout for desktop, tablet, and mobile browsers.
- Interactive modal dialogs for form inputs and deletion confirmations.
- Status badges, priority badges, loading spinners, and empty states.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Lucide React Icons |
| **Styling** | Custom Glassmorphism CSS System (Vanilla CSS Design Tokens) |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 18 |
| **ORM** | Prisma ORM |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs |
| **Security** | Express Rate Limit, Helmet, CORS, Express Validator |

---

## 📁 Folder Structure

```text
TaskFlow/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Prisma Schema mapped to PostgreSQL taskflow DB
│   ├── src/
│   │   ├── config/               # Prisma Client & Env configurations
│   │   ├── controllers/          # Auth, Project, Task, and Dashboard logic
│   │   ├── middleware/           # Auth JWT, Rate Limiter, Error Handler, Validator
│   │   ├── routes/               # Express API endpoints (/api/*)
│   │   ├── utils/                # Standardized API response formatters
│   │   ├── validators/           # Express-validator input rules
│   │   ├── app.js                # Express app setup & security middleware
│   │   └── server.js             # HTTP server entrypoint
│   ├── tests/
│   │   └── api.test.js           # Automated integration test suite
│   ├── .env                      # Environment variables
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/common/    # Badges, Header, Sidebar, Modal, Spinner, Alerts
│   │   ├── context/              # AuthContext & useAuth hook
│   │   ├── layouts/              # DashboardLayout with authentication guard
│   │   ├── pages/                # Login, Register, Dashboard, Projects, Tasks, etc.
│   │   ├── services/             # Axios API client & endpoints
│   │   ├── App.jsx               # React Router configuration
│   │   ├── index.css             # Glassmorphism design tokens & styles
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── API_DOCUMENTATION.md          # Comprehensive REST API reference
├── DATABASE_SCHEMA.md            # PostgreSQL & Prisma data models
├── ER_DIAGRAM.md                 # Entity Relationship Diagram (Mermaid)
├── Dockerfile                    # Containerization for deployment
├── docker-compose.yml            # Multi-container orchestration
└── README.md                     # Project overview and setup instructions
```

---

## ⚙️ Prerequisites & Environment Variables

### Requirements
- **Node.js**: v18.0+ (Tested on v22.20.0)
- **PostgreSQL**: v14+ (Tested on v18.0)
- **npm**: v9+

### Environment Configuration (`.env`)

Create a `.env` file inside `backend/`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow?schema=public"
JWT_SECRET="taskflow_jwt_super_secret_key_2026_production_secure_789!@#"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

---

## 🚀 Quick Start & Local Execution

### Step 1: PostgreSQL Setup
Make sure PostgreSQL is running on `localhost:5432` and the database `taskflow` exists:

```sql
CREATE DATABASE taskflow;
```

### Step 2: Backend Setup & Server Start

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Start Backend Server (runs on port 5000)
npm run dev
```

### Step 3: Frontend Setup & Dev Server

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite Development Server (runs on port 5173)
npm run dev
```

Open your browser and visit: **`http://localhost:5173`**

---

## 🧪 Running Automated Integration Tests

TaskFlow includes an automated integration test suite that tests all 12 API endpoints (registration, login, profile, project CRUD, task CRUD, filtering, dashboard calculation, and 401 unauthenticated security):

```bash
cd backend
npm test
```

---

## 🚢 Docker & Deployment

To run TaskFlow using Docker Compose:

```bash
docker-compose up --build
```

---

## 📄 Documentation Reference

- **[API Documentation](file:///c:/DISK-D/Personal%20folder/TaskFlow/API_DOCUMENTATION.md)**: Full REST API specs with requests and responses.
- **[Database Schema](file:///c:/DISK-D/Personal%20folder/TaskFlow/DATABASE_SCHEMA.md)**: Table definitions, data types, and index constraints.
- **[ER Diagram](file:///c:/DISK-D/Personal%20folder/TaskFlow/ER_DIAGRAM.md)**: Entity Relationship Diagram.
