# TaskFlow Entity Relationship (ER) Diagram

The diagram below illustrates the relational schema, card capabilities, and foreign key relationships between `users`, `projects`, and `tasks`.

```mermaid
erDiagram
    users ||--o{ projects : "owns (1:N)"
    users ||--o{ tasks : "creates (1:N)"
    projects ||--o{ tasks : "contains (1:N)"

    users {
        int id PK
        string full_name "VARCHAR(100)"
        string email UK "VARCHAR(255)"
        string password "VARCHAR(255)"
        timestamp created_at
    }

    projects {
        int id PK
        int user_id FK
        string name "VARCHAR(150)"
        text description
        string status "VARCHAR(20)"
        date start_date
        date end_date
        timestamp created_at
    }

    tasks {
        int id PK
        int project_id FK
        int user_id FK
        string name "VARCHAR(150)"
        text description
        string priority "VARCHAR(10)"
        string status "VARCHAR(20)"
        date due_date
        timestamp created_at
    }
```

---

## Relationship Overview
- **User to Projects (1 : N)**: One user can own multiple projects (`projects.user_id -> users.id`).
- **Project to Tasks (1 : N)**: One project can contain multiple tasks (`tasks.project_id -> projects.id`).
- **User to Tasks (1 : N)**: Tasks belong directly to the authenticated user (`tasks.user_id -> users.id`).
