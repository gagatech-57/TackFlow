# TaskFlow REST API Documentation

All API requests are prefixed with `/api`. Authenticated endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Register a new user account.

- **Rate Limit**: 20 requests per 15 minutes per IP.
- **Request Body**:
  ```json
  {
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully.",
    "data": {
      "user": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-09-11T10:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

---

### `POST /api/auth/login`
Authenticate existing user.

- **Rate Limit**: 20 requests per 15 minutes per IP.
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "user": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-09-11T10:00:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR..."
    }
  }
  ```

---

### `POST /api/auth/logout`
Log out current user (client discards stored token).

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully."
  }
  ```

---

### `GET /api/auth/me`
Retrieve authenticated user profile.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "User profile fetched successfully.",
    "data": {
      "user": {
        "id": 1,
        "fullName": "John Doe",
        "email": "john@example.com",
        "createdAt": "2026-09-11T10:00:00.000Z"
      }
    }
  }
  ```

---

## 2. Project Management Endpoints (`/api/projects`)

### `GET /api/projects`
List all projects owned by authenticated user.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Query Parameters**:
  - `search` (string): Search by project name (case-insensitive)
  - `status` (string): Filter by `Not Started`, `In Progress`, or `Completed`
  - `page` (number): Default `1`
  - `limit` (number): Default `100`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Projects retrieved successfully.",
    "data": [
      {
        "id": 1,
        "userId": 1,
        "name": "E-Commerce Overhaul",
        "description": "Redesign store frontend",
        "status": "In Progress",
        "startDate": "2026-09-01T00:00:00.000Z",
        "endDate": "2026-10-31T00:00:00.000Z",
        "createdAt": "2026-09-11T10:00:00.000Z",
        "_count": {
          "tasks": 3
        }
      }
    ],
    "meta": {
      "totalCount": 1,
      "page": 1,
      "totalPages": 1
    }
  }
  ```

---

### `GET /api/projects/:id`
Get single project details and associated tasks.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Project details retrieved successfully.",
    "data": {
      "id": 1,
      "userId": 1,
      "name": "E-Commerce Overhaul",
      "description": "Redesign store frontend",
      "status": "In Progress",
      "startDate": "2026-09-01T00:00:00.000Z",
      "endDate": "2026-10-31T00:00:00.000Z",
      "tasks": [
        {
          "id": 1,
          "name": "Implement Cart",
          "priority": "High",
          "status": "Pending"
        }
      ]
    }
  }
  ```

---

### `POST /api/projects`
Create a new project.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "name": "Mobile Application",
    "description": "iOS and Android build",
    "status": "Not Started",
    "startDate": "2026-10-01",
    "endDate": "2026-12-15"
  }
  ```

---

### `PUT /api/projects/:id`
Update an existing project owned by logged-in user.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**: Same fields as `POST /api/projects`.

---

### `DELETE /api/projects/:id`
Delete project and all associated tasks.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Project and associated tasks deleted successfully."
  }
  ```

---

## 3. Task Management Endpoints (`/api/tasks`)

### `GET /api/tasks`
List tasks owned by authenticated user.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Query Parameters**:
  - `projectId` (number): Filter by project ID
  - `search` (string): Search by task name
  - `status` (string): `Pending`, `In Progress`, `Completed`
  - `priority` (string): `Low`, `Medium`, `High`

---

### `POST /api/tasks`
Create task under a project.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Request Body**:
  ```json
  {
    "projectId": 1,
    "name": "Create Database Index",
    "description": "Optimize lookup speeds",
    "priority": "High",
    "status": "Pending",
    "dueDate": "2026-09-30"
  }
  ```

---

### `PUT /api/tasks/:id`
Update task properties or toggle status.

- **Headers**: `Authorization: Bearer <TOKEN>`

---

### `DELETE /api/tasks/:id`
Delete individual task.

- **Headers**: `Authorization: Bearer <TOKEN>`

---

## 4. Dashboard Metrics Endpoint (`/api/dashboard`)

### `GET /api/dashboard`
Get aggregated user metrics.

- **Headers**: `Authorization: Bearer <TOKEN>`
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Dashboard metrics calculated successfully.",
    "data": {
      "totalProjects": 5,
      "projectsInProgress": 2,
      "totalTasks": 12,
      "completedTasks": 8,
      "pendingTasks": 4,
      "recentProjects": [...],
      "upcomingTasks": [...]
    }
  }
  ```
