# Event Ticket System

## Overview

Event Ticket System is a web platform that allows organizers to manage event registrations, generate personalized QR tickets, and validate attendees during event access.

The first version (MVP) focuses on speed, simplicity and zero infrastructure costs.

---

# MVP Goals

The system must allow:

- Display a landing page for an event.
- Show event information.
- Allow users to register through a form.
- Store participant information.
- Notify the administrator through Telegram.
- Manage participants from an admin dashboard.
- Generate personalized tickets.
- Generate a unique QR for every ticket.
- Validate tickets by scanning the QR.
- Mark tickets as used.

---

# Stack

Frontend
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui

Backend
- Next.js Route Handlers (API Routes)

Database
- PostgreSQL

ORM
- Prisma

Validation
- Zod

Forms
- React Hook Form

QR
- qrcode
- html5-qrcode

Images
- html-to-image

PDF
- jsPDF

Notifications
- Telegram Bot API

Deployment
- Vercel

---

# Architecture

This project uses a Full Stack Next.js architecture.

There is NO separated NestJS backend.

Everything lives inside one repository.

Next.js
│
├── Frontend
├── API Routes
├── Prisma
└── PostgreSQL

---

# Design Principles

The UI should be:

- Clean
- Premium
- Modern
- Mobile First
- Fast
- Accessible

The design should be inspired by:

- Apple
- Stripe
- Linear
- Vercel

---

# Development Rules

Always:

- Write reusable components.
- Keep components small.
- Avoid duplicated code.
- Use TypeScript everywhere.
- Use feature-based architecture.
- Keep business logic outside UI components.
- Prefer composition over inheritance.
- Use Server Components when possible.
- Use Client Components only when needed.

---

# Folder Structure

app/

components/

features/

lib/

prisma/

public/

types/

---

# MVP Scope

Landing

Registration Form

Participant Registration

Telegram Notification

Admin Dashboard

Ticket Generator

QR Validation

Scanner

---

# Out of Scope (for MVP)

Payments

WhatsApp API

Email automation

Multiple events

User roles

Statistics

Multi-language

Offline validation
