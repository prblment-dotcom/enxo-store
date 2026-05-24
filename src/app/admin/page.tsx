'use client';

import { useState } from 'react';

interface EmailRow {
  id: number;
  email: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [emails, setEmails] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchEmails(pw: string) {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/emails', {
        headers: { 'x-admin-password': pw },
      });
      if (res.status === 401) {
        setError('Wrong password.');
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError('Failed to load emails.');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setEmails(data.emails || []);
      setAuthed(true);
    } catch {
      setError('Network error.');
    }
    setLoading(false);
  }

  function downloadCsv() {
    const rows = ['email,signed_up_at', ...emails.map(e => `${e.email},${e.created_at}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wishlist_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <p className="text-white font-black text-xl uppercase tracking-[0.3em] text-center mb-8">
            ENXO Admin
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); fetchEmails(password); }}
            className="flex flex-col gap-3"
          >
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border border-white text-white placeholder-gray-500 text-sm uppercase tracking-widest px-4 py-3 outline-none focus:border-gray-300 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors disabled:opacity-60"
            >
              {loading ? '...' : 'Enter'}
            </button>
            {error && <p className="text-red-400 text-xs uppercase tracking-widest text-center">{error}</p>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-white font-black text-xl uppercase tracking-[0.3em]">ENXO Admin</p>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">
              {emails.length} {emails.length === 1 ? 'subscriber' : 'subscribers'}
            </p>
          </div>
          <button
            onClick={downloadCsv}
            className="bg-white text-black text-xs font-black uppercase tracking-widest px-5 py-2 hover:bg-gray-200 transition-colors"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        {emails.length === 0 ? (
          <p className="text-gray-500 text-xs uppercase tracking-widest text-center py-20">
            No subscribers yet.
          </p>
        ) : (
          <div className="border border-white/10">
            <div className="grid grid-cols-[1fr_auto] border-b border-white/10 px-4 py-2">
              <span className="text-gray-500 text-xs uppercase tracking-widest">Email</span>
              <span className="text-gray-500 text-xs uppercase tracking-widest">Date</span>
            </div>
            {emails.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-[1fr_auto] border-b border-white/5 px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <span className="text-white text-sm">{row.email}</span>
                <span className="text-gray-500 text-xs self-center">
                  {new Date(row.created_at).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={() => fetchEmails(password)}
          disabled={loading}
          className="mt-6 text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors disabled:opacity-40"
        >
          {loading ? 'Loading...' : '↺ Refresh'}
        </button>
      </div>
    </div>
  );
}
