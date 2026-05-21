'use client';

import { useEffect, useRef, useState } from 'react';

export default function WishlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [soundOn, setSoundOn] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  // Persisted user preference to attempt sound on subsequent visits
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('videoSoundEnabled') : null;
    if (saved === '1') {
      setSoundOn(true);
    }
  }, []);

  // One-time global gesture to enable audio (covers users that interact before pressing the toggle)
  useEffect(() => {
    const handler = async () => {
      try {
        const v = videoRef.current;
        if (!v) return;
        v.muted = false;
        await v.play();
        setSoundOn(true);
        setAutoplayBlocked(false);
        try { localStorage.setItem('videoSoundEnabled', '1'); } catch {}
      } catch {}
      // remove listeners after first attempt
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', handler);
      window.removeEventListener('keydown', handler);
    };

    window.addEventListener('pointerdown', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return removeListeners;
  }, []);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

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

  // Try to start playback with sound enabled on mount. Browsers may block this; fail silently.
  useEffect(() => {
    if (!videoRef.current) return;
    if (!soundOn) return;
    (async () => {
      try {
        const v = videoRef.current;
        if (!v) return;
        v.muted = false;
        await v.play();
        // autoplay with audio succeeded
        setAutoplayBlocked(false);
      } catch (e) {
        // If autoplay is blocked, keep it muted and update state so UI reflects that
        try {
          const v2 = videoRef.current;
          if (v2) v2.muted = true;
        } catch {}
        setSoundOn(false);
        setAutoplayBlocked(true);
      }
    })();
  }, [soundOn, isDesktop]);

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
          src={isDesktop ? "/images/MERCH MOVIE.mp4" : "/images/MERCH MOVIE PHONE V.mp4"}
          autoPlay
          playsInline
          muted={!soundOn}
        />
      )}

      {/* Smooth loop handler: seek slightly before the end to avoid a gap */}
      {isDesktop !== null && <LoopHandler videoRef={videoRef} />}

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
        {autoplayBlocked && (
          <div className="mb-2 text-xs text-white/90 text-right">Tap the speaker to enable audio</div>
        )}
        <button
          onClick={async () => {
                const newVal = !soundOn;
                // If enabling sound, attempt to unmute and play; if it fails, keep muted and mark blocked
                if (newVal) {
                  try {
                    const v = videoRef.current;
                    if (!v) return;
                    v.muted = false;
                    await v.play();
                    setSoundOn(true);
                    setAutoplayBlocked(false);
                  } catch (e) {
                    // autoplay blocked — keep muted
                    try { if (videoRef.current) videoRef.current.muted = true; } catch {}
                    setSoundOn(false);
                    setAutoplayBlocked(true);
                  }
                } else {
                  // disabling sound — just mute
                  try { if (videoRef.current) videoRef.current.muted = true; } catch {}
                  setSoundOn(false);
                }
              }}
          title={soundOn ? 'Mute background video' : 'Unmute background video'}
          className="bg-white/10 text-white backdrop-blur-sm px-3 py-2 rounded-full text-xs font-bold"
        >
          {soundOn ? '🔊' : '🔈'}
        </button>
      </div>

      {/* Fullscreen overlay that prompts user to enable audio when autoplay is blocked */}
      {autoplayBlocked && (
        <div
          role="button"
          aria-label="Enable audio"
          onClick={async () => {
            try {
              const v = videoRef.current;
              if (!v) return;
              v.muted = false;
              await v.play();
              setSoundOn(true);
              setAutoplayBlocked(false);
            } catch (e) {
              // keep blocked
            }
          }}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 text-white text-center p-6"
        >
          <div className="max-w-md">
            <p className="font-black text-xl mb-4">Enable audio</p>
            <p className="text-sm mb-6">Tap anywhere to enable sound for this site.</p>
            <div className="inline-block bg-white text-black px-4 py-2 rounded-full font-bold">Tap to enable</div>
          </div>
        </div>
      )}

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

