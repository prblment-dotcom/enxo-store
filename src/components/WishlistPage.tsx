'use client';

import { useRef, useState } from 'react';

export default function WishlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [soundOn, setSoundOn] = useState(false);
  const desktopVidRef = useRef<HTMLVideoElement | null>(null);
  const mobileVidRef = useRef<HTMLVideoElement | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    setLoading(true);
    setError('');

    // Store in localStorage as a simple wishlist (can be wired to a backend later)
    const existing = JSON.parse(localStorage.getItem('wishlist_emails') || '[]');
    if (!existing.includes(email)) {
      existing.push(email);
      localStorage.setItem('wishlist_emails', JSON.stringify(existing));
    }

    await new Promise((r) => setTimeout(r, 600)); // small delay for feel
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">

      {/* Desktop Video */}
      <video
        ref={desktopVidRef}
        className="absolute inset-0 w-full h-full object-cover hidden sm:block"
        src="/images/MERCH MOVIE.mp4"
        autoPlay
        loop
        muted={!soundOn}
        playsInline
      />

      {/* Mobile Video */}
      <video
        ref={mobileVidRef}
        className="absolute inset-0 w-full h-full object-cover block sm:hidden"
        src="/images/MERCH MOVIE PHONE V.mp4"
        autoPlay
        loop
        muted={!soundOn}
        playsInline
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Logo top center */}
      <div className="absolute top-6 w-full flex justify-center z-10">
        <span className="text-white font-black text-xl uppercase tracking-[0.3em]">ENXO</span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-14 px-4">

        {!submitted ? (
          <>
            <p className="text-white text-xs uppercase tracking-[0.25em] mb-5 text-center">
              Join the wishlist — be first to know
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="flex-1 bg-transparent border border-white text-white placeholder-gray-500 text-xs uppercase tracking-widest px-4 py-3 outline-none focus:border-gray-300 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-60"
              >
                {loading ? '...' : 'Notify Me'}
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-xs uppercase tracking-widest mt-2">{error}</p>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-white font-black text-xs uppercase tracking-[0.3em]">You&apos;re on the list.</p>
            <p className="text-gray-400 text-xs uppercase tracking-widest">We&apos;ll let you know when it drops.</p>
          </div>
        )}

        {/* Shop link */}
        <a
          href="/products/1"
          className="mt-6 text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-white transition-colors border-b border-gray-600 hover:border-white pb-0.5"
        >
          Shop Now
        </a>
      </div>

      {/* Unmute toggle */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={async () => {
            const newVal = !soundOn;
            setSoundOn(newVal);

            // Update actual video element muted state and attempt to play when unmuting
            try {
              if (desktopVidRef.current) desktopVidRef.current.muted = !newVal;
              if (mobileVidRef.current) mobileVidRef.current.muted = !newVal;

              if (newVal) {
                // Some browsers require a user gesture to start audio; since this is user-initiated, play() should succeed
                await desktopVidRef.current?.play();
                await mobileVidRef.current?.play();
              }
            } catch (e) {
              // ignore play errors
            }
          }}
          title={soundOn ? 'Mute background video' : 'Unmute background video'}
          className="bg-white/10 text-white backdrop-blur-sm px-3 py-2 rounded-full text-xs font-bold"
        >
          {soundOn ? '🔊' : '🔈'}
        </button>
      </div>

    </div>
  );
}

