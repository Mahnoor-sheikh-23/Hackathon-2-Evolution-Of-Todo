# Research: AI-Powered Todo Chatbot

## Overview
Research document for the AI-Powered Todo Chatbot feature, covering technology decisions, architecture patterns, and implementation approaches.

## Decision: OpenRouter vs OpenAI API
**Rationale**: OpenRouter provides access to multiple LLMs with a unified API, potentially offering better cost/performance than OpenAI's GPT models. It supports various models optimized for different tasks, and the pricing may be more favorable for this application.

**Alternatives considered**:
- OpenAI API directly
- Anthropic Claude
- Self-hosted models (Ollama, etc.)

## Decision: MCP Tools Architecture
**Rationale**: MCP (Model Context Protocol) tools provide a standardized way to give AI agents access to external functions. This allows the AI to understand and call specific functions to manage tasks, which is essential for the natural language task management functionality.

**Alternatives considered**:
- Prompt engineering only (AI generates structured commands)
- Custom function calling system
- Direct API calls from frontend

## Decision: Conversation Storage Approach
**Rationale**: Storing conversations and messages in PostgreSQL maintains consistency with existing data storage patterns in the application. It provides reliable persistence, supports complex queries for conversation history, and integrates well with the existing authentication system.

**Alternatives considered**:
- Separate database (Redis for ephemeral, PostgreSQL for persistent)
- File-based storage
- External service (Supabase, Firebase)

## Decision: Frontend Chat Widget Implementation
**Rationale**: A floating chat widget implemented as a React component with Tailwind CSS provides good performance, responsive design, and smooth animations. Using Next.js App Router ensures proper routing and state management.

**Alternatives considered**:
- Third-party chat widget (ChatKit, etc.)
- Custom vanilla JavaScript implementation
- iframe-based solution

## Decision: Authentication Integration
**Rationale**: Using the existing Better Auth JWT system ensures consistency with the existing authentication flow and maintains user data isolation. The same JWT validation approach used for task APIs can be applied to the chat API.

**Alternatives considered**:
- Separate authentication for chat functionality
- OAuth providers specifically for chat
- Session-based authentication

## Decision: Real-time Communication Approach
**Rationale**: Using REST API with client-side polling for now provides simplicity and consistency with existing API patterns. WebSocket could be added later if needed for better real-time experience.

**Alternatives considered**:
- WebSocket connections
- Server-Sent Events (SSE)
- Real-time database subscriptions

## Decision: AI Agent Configuration
**Rationale**: OpenAI Agents SDK with OpenRouter provides the best balance of functionality and ease of use for creating an AI assistant that can call tools. It handles conversation context management and tool calling orchestration.

**Alternatives considered**:
- LangChain
- Custom implementation with raw OpenAI API
- Anthropic's function calling
- Open-source alternatives (LlamaIndex, etc.)

## Technology Stack Summary
- Backend: Python with FastAPI for API, SQLModel for database access
- AI/ML: OpenAI Agents SDK with OpenRouter API for LLM access
- Database: PostgreSQL (Neon) for conversations and messages
- Frontend: Next.js 16+ with React and Tailwind CSS
- Authentication: Better Auth JWT tokens
- MCP Tools: Custom tools for task management operations