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
  const [showExportUi, setShowExportUi] = useState(false);
  const [showDebugUi, setShowDebugUi] = useState(false);

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
    // addEventListener('change') isn't supported in older Safari; provide a fallback
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handle);
      return () => mq.removeEventListener('change', handle);
    }
    if (typeof (mq as any).addListener === 'function') {
      (mq as any).addListener(handle);
      return () => (mq as any).removeListener(handle);
    }
    return undefined;
  }, []);

  // Show export UI when ?export_emails=1 is present (manual admin trigger)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('export_emails') === '1') setShowExportUi(true);
        if (params.get('video_debug') === '1') setShowDebugUi(true);
      }
    } catch (e) {}
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

      {/* Export UI injected when ?export_emails=1 */}
      {showExportUi && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <ExportEmailsButton />
        </div>
      )}

      {showDebugUi && (
        <div className="fixed top-6 left-4 z-40">
          <VideoDebugOverlay videoRef={videoRef} />
        </div>
      )}

    </div>
  );
}


function ExportEmailsButton() {
  const downloadCsv = () => {
    try {
      const raw = localStorage.getItem('wishlist_emails') || '[]';
      const arr = JSON.parse(raw);
      // create CSV
      const csv = (arr.length ? ["email"] : []).concat(arr.map((e: string) => e)).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wishlist_emails.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      try { navigator.clipboard.writeText(localStorage.getItem('wishlist_emails') || '[]'); } catch {}
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={downloadCsv}
        className="bg-white text-black px-4 py-2 rounded font-bold text-sm"
      >
        Export emails (CSV)
      </button>
    </div>
  );
}


function VideoDebugOverlay({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  const [state, setState] = useState({ muted: true, paused: true, currentTime: 0, duration: 0, readyState: 0 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const refresh = () => setState({ muted: !!v.muted, paused: v.paused, currentTime: v.currentTime || 0, duration: v.duration || 0, readyState: v.readyState });
    const interval = setInterval(refresh, 500);
    v.addEventListener('play', refresh);
    v.addEventListener('pause', refresh);
    v.addEventListener('volumechange', refresh);
    v.addEventListener('timeupdate', refresh);
    refresh();
    return () => {
      clearInterval(interval);
      try { v.removeEventListener('play', refresh); v.removeEventListener('pause', refresh); v.removeEventListener('volumechange', refresh); v.removeEventListener('timeupdate', refresh); } catch {}
    };
  }, [videoRef]);

  const attemptPlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.muted = false;
      await v.play();
      console.log('play succeeded');
    } catch (e) {
      console.error('play failed', e);
      try { v.muted = true; } catch {}
    }
  };

  const logState = () => {
    const v = videoRef.current;
    console.log('video element state', v, { muted: v?.muted, paused: v?.paused, currentTime: v?.currentTime, duration: v?.duration, readyState: v?.readyState });
  };

  return (
    <div className="bg-white/90 text-black p-3 rounded shadow max-w-xs">
      <div className="text-xs font-bold mb-2">Video debug</div>
      <div className="text-[11px] mb-2">
        muted: {String(state.muted)}<br />
        paused: {String(state.paused)}<br />
        time: {Math.round(state.currentTime * 100) / 100} / {isFinite(state.duration) ? Math.round(state.duration * 100) / 100 : 'N/A'}<br />
        readyState: {state.readyState}
      </div>
      <div className="flex gap-2">
        <button onClick={attemptPlay} className="px-2 py-1 text-xs bg-black text-white rounded">Attempt play</button>
        <button onClick={logState} className="px-2 py-1 text-xs bg-gray-200 rounded">Log</button>
      </div>
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

