// Ensure window.fetch is writable and handle getter-only environments gracefully
(function() {
  try {
    const target = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
    if (target && 'fetch' in target) {
      let currentFetch = target.fetch;
      Object.defineProperty(target, 'fetch', {
        get: () => currentFetch,
        set: (fn) => {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch {
    // ignore
  }

  // Gracefully handle benign AbortError and popup closures across browser/iframe environments
  if (typeof window !== 'undefined') {
    window.addEventListener('unhandledrejection', (event) => {
      const reason = event?.reason;
      const msg = (reason?.message || String(reason || '')).toLowerCase();
      const name = reason?.name || '';
      const code = reason?.code || '';
      if (
        name === 'AbortError' ||
        code === 'auth/popup-closed-by-user' ||
        code === 'auth/cancelled-popup-request' ||
        msg.includes('aborted a request') ||
        msg.includes('user aborted')
      ) {
        event.preventDefault();
        return;
      }
    });

    window.addEventListener('error', (event) => {
      const msg = (event?.message || '').toLowerCase();
      if (msg.includes('aborted a request') || msg.includes('user aborted')) {
        event.preventDefault();
        return;
      }
    });
  }
})();

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <App />
);
