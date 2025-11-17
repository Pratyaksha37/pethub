🐾 PetHub – A Pet Adoption & Care Platform

PetHub is a full-stack Next.js platform that helps users explore pets, apply for adoption, and manage their profiles — while admins can add, update, and manage pet listings securely.

👉 Live Project: https://pethub-89rl.vercel.app

📘 Project Proposal
Problem Statement

People often struggle to find verified pet adoption sources or keep track of adoption-related information. Shelters and organizations also lack a centralized system to manage pet listings and interact with adopters.

PetHub solves this by offering:

A unified space to browse pets, view details, and submit adoption applications.

A secure dashboard for admins to manage pets and review adoption requests.

The goal is to make adoption accessible, safe, and organized for everyone.

🏗 System Architecture
Next.js (Fullstack: Pages + API Routes) → Prisma ORM → PostgreSQL

App Logic

Next.js App Router

TailwindCSS for UI

Next.js API Routes for backend logic

JWT-based authentication

Database

PostgreSQL (Prisma ORM)

Connected through Prisma Data Proxy / Accelerate

Hosting

Entire application deployed on Vercel

Database hosted via Prisma

⭐ Key Features
🔐 Authentication & Authorization

Signup, login, and logout

JWT-based authentication

Role-based access (Admin / User)

🐶 Pet Listings (CRUD)

Admins can:

Add new pets

Edit pet details

Delete listings

Users can:

View all pets

View pet details

📩 Adoption Management

Users can apply for adoption

Admins can review, approve, or reject applications

Users can track their adoption history

👤 Profile Management

View personal details

View adoption applications

📍 Nearby Pet Care Centers

Uses Google Maps API

Displays nearby vet and pet-care centers

☁ Hosting

Frontend + Backend: Vercel

Database: Prisma PostgreSQL

🧰 Tech Stack
Layer	Technologies
Framework	Next.js (App Router)
UI	TailwindCSS
Database	PostgreSQL (Prisma ORM)
Backend	Next.js API Routes
Auth	JWT
Maps	Google Maps API
Hosting	Vercel
📡 API Overview

Endpoint	Method	Description	Access

| Endpoint               | Method | Description             | Access |
| ---------------------- | ------ | ----------------------- | ------ |
| `/api/auth/signup`     | POST   | Register user           | Public |
| `/api/auth/login`      | POST   | Login user              | Public |
| `/api/pets`            | GET    | Fetch pets              | Public |
| `/api/pets/:id`        | GET    | Pet details             | Public |
| `/api/pets`            | POST   | Add pet                 | Admin  |
| `/api/pets/:id`        | PUT    | Update pet              | Admin  |
| `/api/pets/:id`        | DELETE | Delete pet              | Admin  |
| `/api/pets/:id/apply`  | POST   | Apply for adoption      | Auth   |
| `/api/applications/me` | GET    | User’s applications     | Auth   |
| `/api/applications`    | GET    | All applications        | Admin  |
| `/api/care/nearby`     | GET    | Nearby pet-care centers | Auth   |
