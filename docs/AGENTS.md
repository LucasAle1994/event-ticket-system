# AI Agent Instructions

You are working on the Event Ticket System project.

Before making any modification, read:

- PROJECT.md
- DECISIONS.md
- TASKS.md

These documents define the architecture and project rules.

Do NOT ignore them.

---

# Project Goal

Build a reusable Event Registration and QR Ticket platform.

This is NOT a prototype.

This is NOT a demo.

Everything should be production ready.

---

# General Rules

Always keep the project simple.

Avoid overengineering.

Prefer readability over cleverness.

Never introduce unnecessary abstractions.

Never install libraries without a valid reason.

Never replace existing architecture without approval.

---

# Architecture

Use Next.js Full Stack.

Do NOT create a separated backend.

Do NOT introduce NestJS.

Do NOT introduce Express.

Business logic belongs inside services.

UI components should remain presentation only.

---

# Folder Organization

Respect the feature-based architecture.

Never move folders unless explicitly requested.

Never rename folders without approval.

---

# Dependencies

Before installing a dependency ask yourself:

Is it really necessary?

If the same functionality already exists inside the project,
reuse it.

Avoid duplicate libraries.

---

# Code Style

Use TypeScript.

No "any".

Prefer interfaces.

Prefer named exports.

Keep functions small.

Keep components small.

Avoid files over 250 lines whenever possible.

---

# React

Prefer Server Components.

Use Client Components only when necessary.

Avoid unnecessary useEffect.

Avoid prop drilling.

Prefer composition.

---

# UI

Use TailwindCSS.

Use shadcn/ui.

Keep UI modern.

Mobile First.

Accessibility matters.

---

# Forms

Use React Hook Form.

Validate with Zod.

Never duplicate validations.

---

# Database

Use Prisma.

Never write raw SQL unless requested.

Always prefer Prisma.

---

# API

Use Route Handlers.

Keep route handlers thin.

Business logic belongs in services.

---

# Performance

Avoid unnecessary renders.

Avoid unnecessary API calls.

Avoid unnecessary database queries.

Do not fetch the same data multiple times.

---

# Before finishing any task

Always run

npm run lint

npm run build

If errors exist, fix them.

Never consider a task complete while build fails.

---

# Git

Never create commits.

Never push.

Never create branches.

The developer is responsible for Git.

---

# If something is unclear

Never guess.

Explain the issue.

Propose alternatives.

Wait for approval.
