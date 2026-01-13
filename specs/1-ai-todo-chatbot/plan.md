# Implementation Plan: AI-Powered Todo Chatbot

**Branch**: `1-ai-todo-chatbot` | **Date**: 2026-01-09 | **Spec**: [link to spec.md](../../specs/1-ai-todo-chatbot/spec.md)
**Input**: Feature specification from `/specs/1-ai-todo-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of an AI chatbot that allows authenticated users to manage their todo tasks using natural language commands. The system will include backend MCP tools for task operations, an OpenAI Agent configured with OpenRouter API, conversation persistence in PostgreSQL, and a responsive frontend chat interface with animated UI components.

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/JavaScript (frontend)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, Next.js 16+, Tailwind CSS, SQLModel, Better Auth
**Storage**: Neon PostgreSQL (conversations, messages, existing tasks)
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web application (localhost + Railway deployment)
**Project Type**: Web (backend + frontend structure)
**Performance Goals**: <5s AI response time for 90% of queries, <2s page load time
**Constraints**: JWT authentication required, user data isolation, natural language processing
**Scale/Scope**: Support 1000+ concurrent chat sessions, maintain conversation history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The feature extends the existing Phase II application with new functionality (AI chatbot). According to the constitution, chatbot functionality was explicitly excluded from Phase II (Section 3.3, line 45), but this is Phase III work which is appropriate. The implementation will follow the same security rules as Phase II, using JWT authentication and ensuring user data isolation. The backend will integrate with existing task management APIs without modifying Phase II code as required.

## Project Structure

### Documentation (this feature)

```text
specs/1-ai-todo-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── chatbot/
│   ├── models.py        # Conversation and Message models
│   ├── mcp_tools.py     # MCP tools for task operations
│   ├── agent_runner.py  # OpenAI Agent configuration
│   ├── routes.py        # Chat API endpoints
│   └── utils.py         # Helper functions
└── main.py              # Existing Phase II API (untouched)

frontend/
├── app/
│   ├── chat/
│   │   ├── page.tsx     # Main chat page
│   │   └── components/  # Chat components
│   │       ├── ChatWidget.tsx
│   │       ├── ChatSidebar.tsx
│   │       ├── ChatMessage.tsx
│   │       └── ChatInput.tsx
│   └── page.tsx         # Homepage with chat widget
├── lib/
│   └── chatApi.ts       # Chat API client
└── components/          # Existing components (untouched)
```

**Structure Decision**: Web application structure selected with backend chatbot module and frontend chat components. The backend module will be isolated in /backend/chatbot/ to avoid interfering with existing Phase II code. Frontend components will be added to existing Next.js app structure.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| New API endpoints | Required for chat functionality | Using existing task endpoints wouldn't support conversation context |
| MCP tools architecture | Required for AI agent integration | Direct API calls wouldn't allow natural language processing |