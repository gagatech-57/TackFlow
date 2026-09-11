# TaskFlow PostgreSQL & Prisma Database Schema

The database for TaskFlow is named `taskflow`. It contains three core tables: `users`, `projects`, and `tasks`.

---

## 1. Table: `users`
Stores user credentials and profile details.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | **NO** | `nextval('users_id_seq')` | `PRIMARY KEY` | Unique User Identifier |
| `full_name` | `VARCHAR(100)` | **NO** | *None* | - | User's full name |
| `email` | `VARCHAR(255)` | **NO** | *None* | `UNIQUE` | User email (used for login) |
| `password` | `VARCHAR(255)` | **NO** | *None* | - | bcrypt hashed password |
| `created_at` | `TIMESTAMP` | YES | `CURRENT_TIMESTAMP` | - | Account creation date |

---

## 2. Table: `projects`
Stores projects created and owned by users.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | **NO** | `nextval('projects_id_seq')` | `PRIMARY KEY` | Unique Project Identifier |
| `user_id` | `INTEGER` | **NO** | *None* | `FOREIGN KEY (users.id) ON DELETE CASCADE` | Owner User ID |
| `name` | `VARCHAR(150)` | **NO** | *None* | - | Project Name |
| `description` | `TEXT` | YES | `NULL` | - | Project overview |
| `status` | `VARCHAR(20)` | **NO** | `'Not Started'` | `'Not Started' \| 'In Progress' \| 'Completed'` | Project Status Enum |
| `start_date` | `DATE` | YES | `NULL` | - | Project Start Date |
| `end_date` | `DATE` | YES | `NULL` | - | Target End Date |
| `created_at` | `TIMESTAMP` | YES | `CURRENT_TIMESTAMP` | - | Project Creation Date |

---

## 3. Table: `tasks`
Stores tasks assigned to projects and users.

| Column | Data Type | Nullable | Default | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | **NO** | `nextval('tasks_id_seq')` | `PRIMARY KEY` | Unique Task Identifier |
| `project_id` | `INTEGER` | **NO** | *None* | `FOREIGN KEY (projects.id) ON DELETE CASCADE` | Parent Project ID |
| `user_id` | `INTEGER` | **NO** | *None* | `FOREIGN KEY (users.id) ON DELETE CASCADE` | Associated User ID |
| `name` | `VARCHAR(150)` | **NO** | *None* | - | Task Name |
| `description` | `TEXT` | YES | `NULL` | - | Detailed task criteria |
| `priority` | `VARCHAR(10)` | **NO** | `'Medium'` | `'Low' \| 'Medium' \| 'High'` | Priority Level |
| `status` | `VARCHAR(20)` | **NO** | `'Pending'` | `'Pending' \| 'In Progress' \| 'Completed'` | Task Status |
| `due_date` | `DATE` | YES | `NULL` | - | Due Date |
| `created_at` | `TIMESTAMP` | YES | `CURRENT_TIMESTAMP` | - | Creation Timestamp |

---

## Relational Integrity Rules
- **Cascade Deletion**: When a `User` is deleted, all their associated `Projects` and `Tasks` are automatically cascade deleted.
- **Project-Task Cascade**: When a `Project` is deleted, all child `Tasks` under that project are automatically cascade deleted.
- **User Scope Isolation**: All queries filter by `user_id = req.user.id` to guarantee multi-tenant privacy.
