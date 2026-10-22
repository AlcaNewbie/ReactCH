import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// === ANTI F12 / DEVTOOLS (Debugger Stop) ===
;(function antiDevtools() {
  const threshold = 160;

  // 1. Block context menu & shortcuts
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    const k = e.key;
    const c = e.ctrlKey || e.metaKey;
    if (
      k === 'F12' ||
      (c && e.shiftKey && ['I', 'J', 'C'].includes(k.toUpperCase())) ||
      (c && k.toUpperCase() === 'U')
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });

  // 2. Debugger loop (freeze tab saat devtools terbuka)
  function freeze() {
    try {
      // eslint-disable-next-line no-debugger
      debugger;
    } catch {}
    setTimeout(freeze, 50);
  }

  // 3. Size-based detection (desktop docked devtools)
  function checkSize() {
    const w = window.outerWidth - window.innerWidth;
    const h = window.outerHeight - window.innerHeight;
    if (w > threshold || h > threshold) {
      // Trigger debugger storm
      freeze();
      document.body.innerHTML =
        '<div style="display:flex;height:100vh;align-items:center;justify-content:center;font-family:sans-serif;background:#000;color:#fff">DevTools terdeteksi. Tutup DevTools untuk melanjutkan.</div>';
    }
  }
  setInterval(checkSize, 800);

  // 4. Mobile detection (debugger trap)
  let start = Date.now();
  setInterval(() => {
    const t = Date.now();
    // eslint-disable-next-line no-debugger
    debugger;
    if (Date.now() - t > 100) {
      // DevTools open
      setTimeout(freeze, 10);
    }
    start = t;
  }, 1000);
})();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
