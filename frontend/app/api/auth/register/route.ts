import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, confirmPassword } = body;

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const existingUser = db
      .prepare('SELECT * FROM users WHERE email = ? OR username = ?')
      .get(email, username);

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const result = db
      .prepare(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
      )
      .run(username, email, hashedPassword);

    const userId = result.lastInsertRowid as number;

    const token = createToken({
      userId,
      email,
      username,
    });

    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          username,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
