import { useEffect, useState } from 'react';

export default function DocsMenu() {
  const [docs, setDocs] = useState(null);

  useEffect(() => {
    fetch('/api/docs').then(r => r.json()).then(setDocs).catch(() => {});
  }, []);

  if (!docs) return <p className="subtitle">Memuat dokumentasi...</p>;

  return (
    <>
      <h1 className="title">Docs</h1>
      <p className="subtitle">Dokumentasi API yang tersedia di website ini.</p>

      {docs.endpoints.map((ep, i) => (
        <div className="doc-item" key={i}>
          <h3>{ep.name}</h3>
          <span className="method">{ep.method} {ep.path}</span>
          <p>{ep.description}</p>

          <div className="label">Request Body</div>
          <pre>{JSON.stringify(ep.body, null, 2)}</pre>

          <div className="label">Response</div>
          <pre>{JSON.stringify(ep.response, null, 2)}</pre>
        </div>
      ))}

      <div className="doc-item">
        <h3>Catatan</h3>
        <ul style={{ paddingLeft: 20, color: '#888', fontSize: 13, lineHeight: 1.8 }}>
          {docs.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>
    </>
  );
}
