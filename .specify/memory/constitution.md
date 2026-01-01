<!-- SYNC IMPACT REPORT
Version change: 1.0.0 -> 2.0.0 (Major update for Phase II)
Added sections: All sections for the Evolution of Todo - Phase II project
Removed sections: Phase I specific content
Modified principles: All principles updated for Phase II
Templates requiring updates: ⚠ pending review of plan-template.md, spec-template.md, tasks-template.md
Follow-up TODOs: None
-->

# Constitution: Evolution of Todo — Phase II

## 1. Overview
Phase II of the "Evolution of Todo" project transforms the in-memory
console app into a full-stack, multi-user web application with persistent
storage and authentication. All implementation must follow **Spec-Driven
Development using Claude Code + Spec-Kit Plus**.

No manual coding is allowed. This constitution governs **project scope,
data integrity, authentication, and code structure**.

---

## 2. Objectives
- Enable multi-user support
- Implement persistent storage via Neon Serverless PostgreSQL
- Create RESTful API endpoints for task CRUD operations
- Secure API with JWT issued by Better Auth
- Build responsive frontend in Next.js 16+ with Tailwind CSS
- Maintain strict spec-driven workflow

---

## 3. Scope

### Included
- Full-stack Todo app
- Multi-user support
- REST API endpoints
- JWT-based authentication & session management
- Frontend dashboard, login, signup pages
- Task CRUD operations
- Filter, sort, and view tasks per user

### Excluded
- Chatbot or AI agent functionality (Phase III+)
- Event-driven architecture (Phase IV+)
- Voice commands, multi-language support (Phase V / Bonus)
- Non-specified experimental features

---

## 4. Data Model Rules

### User Entity
- Managed by Better Auth
- Fields: `id`, `email`, `name`, `created_at`
- JWT issued on login, used to authenticate API requests

### Task Entity
- Fields: `id`, `user_id`, `title`, `description`, `completed`, `created_at`, `updated_at`
- Each task must belong to exactly one user
- Task IDs are unique
- `completed` defaults to `False`

---

## 5. API Rules
- All API endpoints require valid JWT in header: `Authorization: Bearer <token>`
- Requests without JWT → 401 Unauthorized
- Task ownership enforced:
  - Users can only access or modify their own tasks
- Base endpoints:
  - `GET /api/{user_id}/tasks` → list tasks
  - `POST /api/{user_id}/tasks` → create task
  - `GET /api/{user_id}/tasks/{id}` → task details
  - `PUT /api/{user_id}/tasks/{id}` → update task
  - `DELETE /api/{user_id}/tasks/{id}` → delete task
  - `PATCH /api/{user_id}/tasks/{id}/complete` → toggle completion

---

## 6. Frontend Rules
- Next.js 16+ App Router, Tailwind CSS
- Pages:
  - `/login` → user login
  - `/signup` → user signup
  - `/dashboard` → list and manage tasks
  - `/tasks/[id]` → view/edit task
- All API calls must include JWT from Better Auth
- Server components by default; client components for interactivity only
- Responsive design required

---

## 7. Security Rules
- Shared secret `BETTER_AUTH_SECRET` used for JWT signing/verification
- JWT expiration enforced (e.g., 7 days)
- Backend never stores session info; stateless auth only
- All user data isolation strictly enforced
- Invalid IDs or missing tokens → proper HTTP error codes

---

## 8. Project Structure
- Monorepo layout:

hackathon-todo/
├── .spec-kit/
├── specs/
│ ├── features/
│ ├── api/
│ ├── database/
│ └── ui/
├── frontend/
│ ├── CLAUDE.md
│ └── ...Next.js app
├── backend/
│ ├── CLAUDE.md
│ └── ...FastAPI app
├── CLAUDE.md
├── docker-compose.yml
└── README.md

- Each CLAUDE.md provides instructions for Claude Code in its context

---

## 9. Development Rules
- No manual coding
- All implementation follows **spec → plan → tasks → implement** workflow
- Code must strictly adhere to Phase II scope
- Testing & validation must ensure correctness and security
- Refactor via spec if changes are required, never directly in code

---

## 10. Acceptance Criteria
- Multi-user task CRUD works end-to-end
- JWT authentication works for all API requests
- Frontend communicates with backend properly
- Tasks are persisted in Neon PostgreSQL
- Application follows constitution exactly
- Ready for Phase II submission

## Governance

**Version**: 2.0.0 | **Ratified**: 2025-12-29 | **Last Amended**: 2025-12-29