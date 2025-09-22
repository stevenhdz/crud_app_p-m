import { useEffect, useRef, useState } from 'react';
import axios from "axios";

export default function MeowModal() {
  const [open, setOpen] = useState(false);
  const [facts, setFacts] = useState([]);
  const dialogRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await axios.get(
          "https://meowfacts.herokuapp.com/",
          {
            params: { count: 2, lang: "esp" },
            signal: controller.signal,
          }
        );

        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        if (data.length) {
          setFacts(data);
          setOpen(true);
        }
      } catch (e) {
        if (axios.isCancel(e)) {
          // petición cancelada: no hacer nada
        } else {
          console.error("Error cargando meowfacts:", e);
        }
      }
    })();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={() => setOpen(false)}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="meowfacts-title"
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', padding: 20, maxWidth: 640, width: 'calc(100% - 40px)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h3 id="meowfacts-title" style={{ margin: 0 }}>Sabías que…</h3>
          <button
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            style={{ border: '1px solid #ddd', background: '#f7f7f7', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <ul style={{ marginTop: 12 }}>
          {facts.map((f, i) => <li key={i}>{f}</li>)}
        </ul>

        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <button
            className="secondary"
            onClick={() => setOpen(false)}
            style={{ background: '#555', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
