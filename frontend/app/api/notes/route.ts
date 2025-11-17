import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/lib/db';
import { getCurrentUser } from '@/app/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notes = db
      .prepare('SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC')
      .all(user.userId);

    return NextResponse.json(
      { notes },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get notes error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { note_title, note_content } = await request.json();

    if (!note_title || !note_content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (note_title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    const result = db
      .prepare(
        'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)'
      )
      .run(user.userId, note_title, note_content);

    const note = db
      .prepare('SELECT * FROM notes WHERE id = ?')
      .get(result.lastInsertRowid) as any;

    return NextResponse.json(
      { note },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create note error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
