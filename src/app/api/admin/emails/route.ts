import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  // Simple password check via Authorization header
  const auth = req.headers.get('x-admin-password');
  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await (getSupabase() as any)
      .from('wishlist')
      .select('id, email, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch emails.' }, { status: 500 });
    }

    return NextResponse.json({ emails: data });
  } catch (err) {
    console.error('/api/admin/emails error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
