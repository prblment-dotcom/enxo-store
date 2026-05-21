'use client';

import { useEffect, useRef, useState } from 'react';

export default function WishlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Use muted autoplay to ensure the video always starts. We'll unmute on first user gesture.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  // Ensure the video autoplays muted so users always see the motion background.
  // Also try to restore a previously-granted audio preference (if the user
  // previously allowed sound we attempt to unmute+play on load). Note: some
  // browsers (mobile Safari in particular) still require a user gesture for
  // audible playback — this only helps on browsers/origins that remember prior
  // engagement.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    try {
      // start muted to keep autoplay reliable
      v.muted = true;
      // set inline attributes for iOS webview handling
      try { v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); } catch {}
      try { v.setAttribute('preload', 'auto'); } catch {}
      // attempt a muted play so the visual starts immediately
      v.play().catch(() => {});

      // If the user previously enabled sound, try to restore it now.
      try {
        const pref = localStorage.getItem('videoSoundEnabled');
        if (pref === '1') {
          // some browsers will allow re-playing with sound if the origin
          // previously had a user gesture that played media.
          v.muted = false;
          v.play().then(() => setSoundEnabled(true)).catch(() => {
            // If unmuted play is still blocked, fall back to muted playback.
            try { v.muted = true; } catch {}
          });
        }
      } catch (e) {
        // ignore localStorage errors
      }
    } catch {}
  }, [isDesktop]);

  // One-time global gesture to unmute and play with audio; persist preference
  useEffect(() => {
    const handler = async () => {
      try {
        const v = videoRef.current;
        if (!v) return;
        v.muted = false;
        await v.play();
        try { localStorage.setItem('videoSoundEnabled', '1'); } catch {}
      } catch {}
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };

    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // Helper to unmute from an explicit button press (UI affordance).
  async function enableSound() {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      await v.play();
      try { localStorage.setItem('videoSoundEnabled', '1'); } catch {}
      setSoundEnabled(true);
    } catch (e) {
      // if still blocked, keep muted and don't set pref
      try { v.muted = true; } catch {}
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      setIsDesktop(true);
      return;
    }

    const mq = window.matchMedia('(min-width: 640px)');
    const handle = () => setIsDesktop(!!mq.matches);
    handle();
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, []);

  // We won't programmatically mute/unmute here; the video element below is unmuted by default.

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

      {/* Single runtime-chosen video to avoid duplicate audio */}
      {isDesktop === null ? null : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={isDesktop ? "/images/MERCH MOVIE.mp4" : "/images/download.mp4"}
          autoPlay
          playsInline
          // iOS Safari requires webkit-playsinline to allow inline autoplay
          webkit-playsinline="true"
          // ensure the browser preloads the video for faster start on mobile
          preload="auto"
          muted
          loop
          onCanPlay={() => {
            try { videoRef.current?.play().catch(() => {}); } catch {}
          }}
          onError={(e) => {
            try { console.error('Background video error', e); } catch {}
          }}
        />
      )}

      {/* Smooth loop handler: seek slightly before the end to avoid a gap */}
      {isDesktop !== null && <LoopHandler videoRef={videoRef} />}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Unobtrusive enable-sound button (shown when sound not enabled) */}
      {!soundEnabled && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={enableSound}
            className="bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase px-3 py-2 rounded tracking-widest hover:bg-white/20 active:bg-white/30 transition-colors"
            aria-label="Enable sound"
          >
            Enable sound
          </button>
        </div>
      )}

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

        {/* Shop link removed temporarily to focus on gathering emails */}
      </div>

      {/* No mute/unmute UI — video is intended to play unmuted by default (note: browsers may block this) */}

    </div>
  );
}

// Small helper component that attaches a timeupdate listener to seek when the video is near its end
function LoopHandler({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let rafId: number | null = null;

    const onTimeUpdate = () => {
      // When within 0.06s of the end, jump back to 0 to avoid any gap.
      const threshold = 0.06; // seconds
      if (v.duration && v.duration - v.currentTime <= threshold) {
        // Use requestAnimationFrame to avoid interfering with the playback pipeline.
        if (rafId == null) rafId = requestAnimationFrame(() => {
          try {
            v.currentTime = 0;
          } catch (e) {
            // ignore seek errors
          }
          if (rafId != null) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      }
    };

    v.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      v.removeEventListener('timeupdate', onTimeUpdate);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [videoRef]);

  return null;
}

