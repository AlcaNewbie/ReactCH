import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// === ANTI DEVTOOLS (akurat, tanpa false positive) ===
;(function antiDevtools() {
  let triggered = false;

  // 1. Blokir shortcut & context menu (aman, tidak false positive)
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

  // 2. Debugger trap — deteksi DevTools via timing
  //    Cara kerja: jalankan `debugger` lalu ukur waktu eksekusi.
  //    Jika DevTools terbuka & paused, waktu akan jauh lebih lama.
  function detect() {
    const t0 = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const elapsed = performance.now() - t0;

    // DevTools terbuka & break aktif → elapsed > 100ms
    if (elapsed > 100) {
      triggered = true;
      onDetected();
      return;
    }
    if (!triggered) setTimeout(detect, 1200);
  }

  // 3. Deteksi ukuran — HANYA trigger kalau selisih sangat besar
  //    (DevTools docked besar), bukan scrollbar / zoom / mobile normal
  function checkSize() {
    if (triggered) return;
    const wDiff = window.outerWidth - window.innerWidth;
    const hDiff = window.outerHeight - window.innerHeight;
    // Threshold 300 = sangat yakin DevTools docked besar, bukan hal normal
    if (wDiff > 300 || hDiff > 300) {
      triggered = true;
      onDetected();
    }
  }

  function onDetected() {
    if (document.body.dataset.dtBlocked === '1') return;
    document.body.dataset.dtBlocked = '1';
    document.body.innerHTML = `
      <div style="display:flex;height:100vh;align-items:center;justify-content:center;
                  font-family:system-ui,sans-serif;background:#0a0a0a;color:#f5f5f5;
                  text-align:center;padding:24px">
        <div>
          <h2 style="font-size:20px;margin-bottom:8px">Akses ditolak</h2>
          <p style="color:#888;font-size:14px">Tutup DevTools lalu refresh halaman.</p>
        </div>
      </div>`;
  }

  // Mulai deteksi setelah halaman stabil
  window.addEventListener('load', () => {
    setTimeout(detect, 500);
    setInterval(checkSize, 1500);
  });
})();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
