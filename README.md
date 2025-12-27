# AI Live Chat Support Agent

A full-stack e-commerce demo application showcasing an **AI-powered shopping assistant** built with **Google Gemini**.
The primary goal of this project is to demonstrate **LLM-powered live chat, tool calling, streaming responses, and model fallback** — the e-commerce UI itself is intentionally simple and uses **dummy products**.

---

## Purpose of the Project

- The **frontend e-commerce experience is a demo**, created only to showcase AI chat capabilities.
- Products like **iPhone 16**, **Nike shoes**, and **PS5** are **dummy entries** used for testing recommendations and product-aware conversations.
- The core focus is the **AI chat architecture**, not the shopping UI.

---

## Tech Stack

### Frontend

- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- React Markdown

### Backend

- Next.js API Routes
- TypeScript

### Database

- SQLite (libSQL)
- Drizzle ORM

### AI

- Google Gemini

  - 2.0 Flash Lite
  - 2.5 Flash
  - 2.5 Pro

- Function calling + streaming
- Automatic model fallback on rate limits

---

## Key Features

- Live chat UI with streaming AI responses
- Context-aware shopping assistant
- Product recommendations
- Policy Q&A (shipping, returns, warranty)
- Conversation persistence (session-based)
- Tool calling for product & policy data
- Markdown support in chat
- Product card embeds inside messages

---

## Deployment Notes & Limitations

- **SQLite was chosen for simplicity**, not production readiness.
- The app is deployed on **Render** (not Vercel):

  - Vercel caused **timeouts** due to serverless execution limits with streaming + AI.

- Render **stops the machine on inactivity**:

  - Since SQLite is **file-based**, the database is **wiped on every cold start**.
  - This causes conversation history loss after restarts.

This is a known limitation of the current setup.

---

## Architecture Overview

### API Routes

- `/api/chat` – streaming chat endpoint
- `/api/conversations` – conversation history
- `/api/products` – product catalog

### AI Layer

- Isolated in `lib/ai/chat.ts`
- Tool-based function calling
- Waterfall fallback across Gemini models
- Page-aware context injection

### Data Layer

- SQLite with Drizzle ORM
- Conversations + messages tables
- Messages replayed on reload

---

## Data Model

```sql
conversations
- id (text, primary key)
- created_at (text)

messages
- id (text, primary key)
- conversation_id (text, foreign key)
- role ("user" | "assistant")
- content (text)
- created_at (text)
```

---

## If I Had More Time

- Migrate database to **PostgreSQL**
- Separate backend using **Express.js + Node.js**
- Host frontend on **Vercel** and backend on a long-running server
- Redis-based caching for conversations
- User authentication
- Admin dashboard for chat analytics
- RAG-based product search with embeddings
- Multi-agent routing (sales / support / returns)
- Voice input/output
- WhatsApp / Instagram integrations

---

## Running Locally

```bash
npm install
```

Create `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=file:./sqlite.db
```

Initialize DB:

```bash
npx drizzle-kit push
```

Start dev server:

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

---

## Notes for Reviewers

- Clean separation of concerns (routes → services → data)
- AI layer is **provider-agnostic**
- Tool-based architecture is easy to extend
- Model fallback ensures reliability under rate limits
- Designed as an **AI systems demo**, not a full commerce product

---
