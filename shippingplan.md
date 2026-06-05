# QuikAPI — Shipping Plan

## 1. Idea Validation

**The problem in one sentence:** Frontend developers waste hours every week waiting on backend teammates to set up APIs before they can build anything meaningful.

**How I decided this was worth building:**
This is a pain I've felt personally — sitting with a complete UI, no data to populate it, and a backend teammate who "will get to it tomorrow." I posted the concept in two developer WhatsApp groups and a Discord server before writing a line of code. The response was immediate. Multiple developers said some version of "I literally need this right now." That was enough signal.

**How people solve this problem today:**
- Mock Service Worker (MSW) — complex setup, not real endpoints
- json-server — requires local setup, not shareable
- Postman Mock Servers — paid, complex, overkill for quick projects
- Asking a backend teammate — the slowest option of all

What's broken: every existing solution either requires significant setup time, costs money, or produces fake data that can't actually be hit by a real device. None of them teach you what an API is while you use them.

**Validation:** Posted "what do you use when you need a quick mock API?" in two developer communities. Top answers were "I just wait" and "I spin up json-server but it's annoying." Built for those people.

---

## 2. Target Audience

**Ideal user:** A second-year computer science student in Lagos building a portfolio project. He knows React well but hasn't touched backend yet. He needs an API for his food delivery app concept but doesn't want to spend three days learning Express before he can see data on screen.

**Secondary user:** A freelance frontend developer on a deadline who needs to demo a prototype to a client tomorrow and doesn't have time to wire up a real backend.

**Where they hang out:**
- X (formerly Twitter) — Nigerian tech Twitter, #100DaysOfCode
- Discord — various web dev servers, The Odin Project, Buildspace alumni
- WhatsApp — Nigerian developer communities, university coding groups
- Reddit — r/webdev, r/learnprogramming

**What would make them switch:**
Zero setup. No npm install, no config files, no reading documentation. Just describe what you need in plain English and get a live URL back. That's the entire value proposition.

---

## 3. Tech Stack Rationale

- **Next.js** — chosen because API routes and frontend live in one codebase, one deployment, one repo. No separate backend service to manage during a 10-day build sprint.

- **TypeScript** — non-negotiable for a developer tool. If the code handling other people's schemas isn't type-safe, that's a credibility problem.

- **Groq API (llama-3.1-8b-instant)** — fastest inference available at the time of build. Schema generation needs to feel instant. Groq returns results in under 2 seconds consistently. OpenAI would have worked but Groq is faster and cheaper at this scale.

- **JSON file store** — the intentional tradeoff. SQLite with native bindings failed on Windows during development (both `better-sqlite3` and `bun:sqlite` had compatibility issues with the deployment environment). A JSON file store has zero dependencies, works everywhere, and is more than sufficient for the scale of this hackathon. V2 would use Postgres.

- **Framer Motion** — component-level animations without a separate animation library. The staggered endpoint reveals and schema card transitions would have taken significantly longer with CSS keyframes.

- **driver.js** — the walkthrough tour. Chosen over building a custom spotlight component because it handles scroll, positioning, and keyboard navigation out of the box.

**Tradeoffs made:**
- Skipped authentication entirely — adds complexity, not needed for the core loop to be impressive
- Skipped a dedicated database — JSON file store loses data on container restart; acceptable for demo, not for production
- Chose inline styles over Tailwind classes — more verbose but zero build-time configuration issues across environments

---

## 4. MVP Scope

**Core feature — the one thing QuikAPI does:**
Turn a plain English description into a live, callable REST API with real endpoints in under 60 seconds.

**What's in the MVP:**
- AI schema generator (Groq + llama-3.1-8b-instant)
- Schema editor (edit fields, types, required flags before deploying)
- Live CRUD endpoints (GET, POST, PUT, DELETE per resource)
- Built-in API tester (fire real requests without leaving the page)
- Code snippets (fetch, axios, curl with explanatory comments)
- Dashboard (view and manage all deployed APIs)
- First-visit walkthrough tour (driver.js)

**What was cut and why:**
| Feature | Decision | Reason |
|---------|----------|--------|
| User authentication | Cut | Adds 2+ days of complexity, not needed for judges to evaluate the core |
| Auto-generated /docs page | Cut | API tester already covers this use case |
| Real-time collaboration | Cut | Out of scope for solo 10-day build |
| Postgres database | Cut | Native binding issues on Windows; JSON store ships faster |
| Webhook support | Cut | V2 feature |
| API versioning | Cut | V2 feature |

**What V2 looks like:**
- User accounts with persistent storage (Postgres/Neon)
- Public API gallery — share your API with a link, others can fork it
- Custom domain support for deployed APIs
- Relationship support between resources (foreign keys)
- Rate limiting per API
- OpenAPI/Swagger spec auto-generation
- Nigerian-specific field templates (NIN, BVN, Nigerian phone numbers, states)