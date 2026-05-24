import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email.' }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    const { error } = await (getSupabase() as any)
      .from('wishlist')
      .upsert({ email: normalized }, { onConflict: 'email' });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Could not save email.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('/api/subscribe error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
