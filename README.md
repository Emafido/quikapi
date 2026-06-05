<div align="center">

# ⚡ QuikAPI

### Describe an API. Get a live one.

[![MIT License](https://img.shields.io/badge/License-MIT-a855f7.svg?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Groq](https://img.shields.io/badge/Groq_AI-F55036?style=for-the-badge&logo=data:image/svg+xml;base64,&logoColor=white)](https://groq.com)
[![Built for BuildQuik](https://img.shields.io/badge/Built_for-%23BuildQuik-10B981?style=for-the-badge)](https://quikdb.com)

**Turn plain English into fully live REST APIs in seconds.**
No backend code. No setup. No waiting.

[🚀 Try it Live](quik.quikdb.net) · [📖 How it Works](#-how-it-works) · [🛠 Getting Started](#-getting-started)

---

</div>

## 🎯 The Problem

Every frontend developer knows the pain:

> *You've got a beautiful UI ready to go, but your backend teammate says the API will be ready "tomorrow."*

Existing solutions don't cut it:

| Solution | What's wrong |
|----------|-------------|
| **Mock Service Worker** | Complex setup, not real endpoints |
| **json-server** | Requires local setup, not shareable |
| **Postman Mock Servers** | Paid, complex, overkill for quick projects |
| **Asking a backend dev** | The slowest option of all |

**QuikAPI fixes this.** Describe what you need → get live, callable endpoints → ship your project.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🧠 AI Schema Generator
Describe your API in plain English. QuikAPI uses Groq-powered AI to parse your description and produce a clean, structured schema — resources, fields, types — all inferred automatically.

</td>
<td width="50%">

### ✏️ Schema Editor
Not quite right? Tweak field names, types, and required flags before deploying. Full control without writing a single line of backend code.

</td>
</tr>
<tr>
<td width="50%">

### 🔥 Live API Tester
Fire real `GET`, `POST`, `PUT`, `DELETE` requests right from the app. See real responses. No Postman needed.

</td>
<td width="50%">

### 📋 Code Snippets
Ready-to-copy code for **fetch**, **axios**, and **curl** — with line-by-line explanatory comments so you understand what every line does.

</td>
</tr>
<tr>
<td width="50%">

### 🚀 Instant CRUD Endpoints
One click to deploy. Your API is live immediately with full CRUD operations on every resource. Real URLs, real data.

</td>
<td width="50%">

### 📊 Dashboard
View, manage, and delete all your deployed APIs from one place. Clean interface, zero clutter.

</td>
</tr>
</table>

---

## 🔄 How it Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │     │             │     │             │
│  Describe   │────▶│  Generate   │────▶│    Edit     │────▶│   Deploy   │────▶│    Test     │
│             │     │             │     │             │     │             │     │             │
│  Type what  │     │  AI builds  │     │  Tweak the  │     │  One click  │     │  Fire real  │
│  you need   │     │  a schema   │     │  schema     │     │  and it's   │     │  requests   │
│  in English │     │  for you    │     │  if needed  │     │  live       │     │  instantly  │
│             │     │             │     │             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Example prompt:**
> *"I need an API for a bookstore with books that have titles, authors, prices, and an in-stock flag"*

**What you get in ~30 seconds:**
```
GET    /api/live/abc123/books       → Fetch all books
POST   /api/live/abc123/books       → Add a new book
PUT    /api/live/abc123/books       → Update a book
DELETE /api/live/abc123/books       → Remove a book
```

---

## 🏗 Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 | API routes + frontend in one codebase, one deployment |
| **Language** | TypeScript | Type-safe schema handling = credibility for a dev tool |
| **Styling** | Tailwind CSS | Utility-first, rapid iteration |
| **Animations** | Framer Motion | Smooth component-level transitions and staggered reveals |
| **AI** | Groq API (LLaMA 3.1 8B) | Fastest inference available — schema generation in <2s |
| **Validation** | Zod | Runtime schema validation for rock-solid data handling |
| **Onboarding** | driver.js | Interactive walkthrough tour for first-time users |
| **Storage** | JSON file store | Zero dependencies, works everywhere (Postgres planned for V2) |
| **Deployment** | QuikDB | Built specifically for the BuildQuik hackathon |

---

## 🛠 Getting Started

### Prerequisites

- **Node.js** 20+
- A free [Groq API key](https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/Emafido/quikapi.git

# Navigate to the project
cd quikapi

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Run Locally

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start building APIs.

---

## 🗺 API Reference

<details>
<summary><strong>Core Routes</strong></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/generate` | Generate a schema from a plain-English prompt |
| `GET` | `/api/apis` | List all deployed APIs |
| `POST` | `/api/apis` | Save and deploy a new API |
| `GET` | `/api/apis/[id]` | Get details for a specific API |
| `DELETE` | `/api/apis/[id]` | Delete an API and its data |

</details>

<details>
<summary><strong>Live Endpoints (per deployed API)</strong></summary>

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/live/[apiId]/[resource]` | Fetch all records for a resource |
| `POST` | `/api/live/[apiId]/[resource]` | Create a new record |
| `PUT` | `/api/live/[apiId]/[resource]` | Update an existing record |
| `DELETE` | `/api/live/[apiId]/[resource]` | Delete a record |

</details>

---

## 📁 Project Structure

```
quikapi/
├── src/
│   ├── app/
│   │   ├── api/              # API routes (generate, CRUD, live endpoints)
│   │   ├── dashboard/        # Dashboard page
│   │   ├── page.tsx          # Landing page + Builder
│   │   └── globals.css       # Design tokens & global styles
│   ├── components/
│   │   ├── Builder.tsx       # AI prompt → schema generation
│   │   ├── SchemaEditor.tsx  # Edit schema before deploying
│   │   ├── EndpointList.tsx  # Deployed endpoint display
│   │   ├── ApiTester.tsx     # Live request tester
│   │   ├── CodeSnippet.tsx   # fetch/axios/curl code gen
│   │   ├── Navbar.tsx        # Navigation bar
│   │   └── Walkthrough.tsx   # First-visit guided tour
│   ├── db/                   # JSON file store layer
│   └── lib/                  # Utilities and helpers
├── .env.local                # API keys (not committed)
├── Dockerfile                # Container support
└── package.json
```

---

## 🔮 Roadmap

| Feature | Status |
|---------|--------|
| AI schema generation | ✅ Shipped |
| Schema editor | ✅ Shipped |
| Live CRUD endpoints | ✅ Shipped |
| Built-in API tester | ✅ Shipped |
| Code snippets (fetch, axios, curl) | ✅ Shipped |
| Dashboard | ✅ Shipped |
| Interactive walkthrough | ✅ Shipped |
| User authentication | 🔜 V2 |
| PostgreSQL storage | 🔜 V2 |
| Public API gallery (share & fork) | 🔜 V2 |
| Custom domains for APIs | 🔜 V2 |
| Resource relationships (foreign keys) | 🔜 V2 |
| Rate limiting per API | 🔜 V2 |
| OpenAPI/Swagger auto-generation | 🔜 V2 |

---

## 🏆 Built for #BuildQuik

This project was built as part of the [QuikDB BuildQuik Challenge](https://quikdb.com) — a hackathon for building real, shippable products on the QuikDB platform.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to help improve QuikAPI:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ☕ and a lot of intent by [Emafido](https://github.com/Emafido)**

*If QuikAPI saved you time, consider giving it a ⭐*

</div>
