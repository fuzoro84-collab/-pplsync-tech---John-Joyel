# DAsh Authentication System - Testing Guide

## ✅ Complete JWT Authentication System Implemented

### What Was Built:

1. **SQLite Database** with two tables:
   - `users` table (id, username, email, password, timestamps)
   - `notes` table (id, user_id, title, content, timestamps)

2. **Authentication API Routes**:
   - `/api/auth/register` - User registration with validation
   - `/api/auth/login` - User login with credential verification
   - `/api/auth/logout` - Session cleanup
   - `/api/auth/check` - Authentication check endpoint

3. **Notes CRUD API Routes**:
   - `/api/notes` - GET all notes, POST new note
   - `/api/notes/[id]` - GET, PUT, DELETE specific note

4. **Authentication Features**:
   - Password hashing with bcryptjs (10 salt rounds)
   - JWT tokens with 7-day expiration
   - httpOnly cookies for secure session storage
   - Protected dashboard route
   - Email and password validation

## 🚀 How to Test

### Step 1: Start the Development Server

```bash
npm run dev
```

The server should start on http://localhost:3000 (or 3001 if 3000 is in use)

### Step 2: Test User Registration

1. Navigate to: http://localhost:3001/register
2. Fill in the form:
   - Username: `johndoe`
   - Email: `john@example.com`
   - Password: `Test1234`
   - Confirm Password: `Test1234`
3. Click "Register"
4. ✅ You should be automatically redirected to `/dashboard`
5. ✅ You should see a greeting with your username in the navbar

### Step 3: Test Protected Route

1. Open a new incognito/private browser window
2. Try to access: http://localhost:3001/dashboard
3. ✅ You should be automatically redirected to `/login`

### Step 4: Test User Login

1. Go to: http://localhost:3001/login
2. Enter credentials:
   - Email: `john@example.com`
   - Password: `Test1234`
3. Click "Login"
4. ✅ You should be redirected to `/dashboard`

### Step 5: Test Notes CRUD

1. From the dashboard, click "Add Note"
2. Enter a title and content
3. Click "Save"
4. ✅ The note should appear in the grid
5. Click on the note to edit it
6. Modify the content and save
7. ✅ The note should be updated
8. Click "Delete" on the note
9. Confirm the deletion
10. ✅ The note should disappear

### Step 6: Test Logout

1. Click "Logout" in the navbar
2. ✅ You should be redirected to `/login`
3. Try to access `/dashboard` directly
4. ✅ You should be redirected to `/login` (session cleared)

## 🔍 Validation Tests

### Registration Validation

Test these scenarios to verify validation works:

1. **Empty fields**: Leave any field empty → Should show "All fields are required"
2. **Password mismatch**: Enter different passwords → "Passwords do not match"
3. **Short password**: Use password "Test123" (7 chars) → "Password must be at least 8 characters"
4. **Invalid email**: Use "notanemail" → "Invalid email format"
5. **Duplicate user**: Register same email twice → "User with this email or username already exists"

### Login Validation

1. **Empty fields**: Leave email or password empty → "Email and password are required"
2. **Wrong email**: Use non-existent email → "Invalid email or password"
3. **Wrong password**: Use wrong password → "Invalid email or password"

## 🗄️ Database Structure

The SQLite database (`dev.db`) is created automatically in the project root.

### Users Table Schema:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Notes Table Schema:
```sql
CREATE TABLE notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
)
```

## 🔐 Security Features

- ✅ Passwords hashed with bcryptjs (10 salt rounds)
- ✅ JWT tokens stored in httpOnly cookies (prevents XSS)
- ✅ Secure flag enabled in production
- ✅ SameSite: lax (CSRF protection)
- ✅ 7-day token expiration
- ✅ User-specific note isolation (users can only access their own notes)
- ✅ Server-side authentication validation on all protected routes

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status

### Notes

- `GET /api/notes` - Get all notes for logged-in user
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

## 🐛 Troubleshooting

### If you get database errors:
```bash
# Delete the database and restart the server
Remove-Item dev.db
npm run dev
```

### If authentication doesn't work:
1. Check browser console for errors
2. Check terminal for server-side errors
3. Verify `.env.local` exists with JWT_SECRET
4. Try clearing browser cookies

### If port 3000 is in use:
The dev server will automatically use port 3001. Update URLs accordingly.

## ✨ What's Working

✅ Complete user registration with validation
✅ User login with credential verification
✅ JWT token generation and verification
✅ Secure httpOnly cookie storage
✅ Protected dashboard route
✅ User-specific notes CRUD operations
✅ Session management (7-day expiration)
✅ Logout functionality
✅ Password hashing with bcryptjs
✅ Email and password validation
✅ Responsive UI with Tailwind CSS
✅ Error handling and user feedback

## 🎯 Next Steps (Optional Enhancements)

- Add "Remember Me" functionality
- Implement password reset via email
- Add profile management page
- Implement note search functionality
- Add note categories/tags
- Implement rich text editor for notes
- Add note sharing between users
- Implement dark mode
- Add export notes to PDF/Markdown
