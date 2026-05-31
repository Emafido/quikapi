```markdown
# QuikAPI

**Describe an API. Get a live one.**

QuikAPI turns plain English descriptions into fully live REST APIs in seconds — no backend code, no setup, no waiting.

## What it does

Type what you need → AI generates a schema → edit it → deploy → get real endpoints instantly.

Built for developers who are still learning AND developers who just want to ship fast.

## Features

- **AI Schema Generator** — describe your API in plain English, get structured JSON back
- **Schema Editor** — tweak fields, types, and resources before deploying
- **Live API Tester** — fire real GET, POST, PUT, DELETE requests without leaving the page
- **Code Snippets** — ready-to-copy fetch, axios, and curl code with line-by-line comments
- **Full CRUD Endpoints** — deployed instantly and immediately callable

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **AI:** Groq API (llama-3.1-8b-instant)
- **Storage:** JSON file store (zero dependencies)
- **Deployment:** QuikDB

## Getting Started

### Prerequisites

- Node.js 20+
- A [Groq API key](https://console.groq.com)

### Installation

```bash
git clone https://github.com/Emafido/quikapi.git
cd quikapi
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```
GROQ_API_KEY=your_groq_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How it works

1. **Describe** — type what your API should do in plain English
2. **Generate** — AI produces a clean schema with resources and fields
3. **Edit** — tweak anything before deploying
4. **Deploy** — one click and your endpoints are live
5. **Test** — fire real requests and see real responses right in the app

## API Routes

| Route | Description |
|-------|-------------|
| `POST /api/generate` | Generate schema from prompt |
| `GET /api/apis` | List all deployed APIs |
| `POST /api/apis` | Save a new API |
| `GET /api/apis/[id]` | Get a single API |
| `DELETE /api/apis/[id]` | Delete an API |
| `GET /api/live/[apiId]/[resource]` | Fetch all records |
| `POST /api/live/[apiId]/[resource]` | Create a record |
| `PUT /api/live/[apiId]/[resource]` | Update a record |
| `DELETE /api/live/[apiId]/[resource]` | Delete a record |

## Built for #BuildQuik

This project was built as part of the [QuikDB BuildQuik Challenge](https://quikdb.com).

## License

MIT
```