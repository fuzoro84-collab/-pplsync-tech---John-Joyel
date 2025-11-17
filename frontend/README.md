# DAsh - Notes Taking Application

A modern, full-stack notes-taking application built with Next.js 14, TypeScript, SQLite, and Tailwind CSS.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete notes
- Responsive design for mobile, tablet, and desktop
- Clean and modern UI with custom color scheme
- Session management with JWT tokens
- Protected routes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT with httpOnly cookies, bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters-long
DATABASE_URL=file:./dev.db
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Testing the Authentication

1. Go to http://localhost:3000/register
2. Fill in the registration form:
   - Username: will
   - Email: willjoea007@gmail.com
   - Password: 12345678
   - Confirm Password: 12345678
3. Click "Register" - you should be automatically logged in and redirected to /dashboard
4. Click "Logout" in the dashboard
5. Go to http://localhost:3000/login
6. Login with the credentials you created
7. You should be redirected to /dashboard again

## Project Structure

```
/app
  ├── page.tsx                    # Landing page
  ├── login/page.tsx              # Login page
  ├── register/page.tsx           # Register page
  ├── dashboard/page.tsx          # Main dashboard (protected)
  ├── api/
  │   ├── auth/                   # Authentication endpoints
  │   └── notes/                  # Notes CRUD endpoints
  ├── lib/
  │   ├── db.ts                   # Database connection
  │   ├── auth.ts                 # Auth utilities
  │   ├── session.ts              # Session management
  │   └── models/                 # Mongoose models
  └── components/
      ├── Navbar.tsx
      ├── NoteCard.tsx
      └── NoteModal.tsx
```

## Color Scheme

- Primary Teal: #00A389
- Background: #F9FAFB
- Deep Charcoal: #1F2937
- Muted Yellow: #FFC72C

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT

