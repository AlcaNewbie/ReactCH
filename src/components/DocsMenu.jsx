import { useEffect, useState } from 'react';

export default function DocsMenu() {
  const [docs, setDocs] = useState(null);
  const [url, setUrl] = useState('');
  const [reaction, setReaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('curl');

  useEffect(() => {
    fetch('/api/docs').then(r => r.json()).then(setDocs).catch(() => {});
  }, []);

  async function run(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, reaction })
      });
      setResult(await res.json());
    } catch (err) {
      setResult({ status: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  if (!docs) return <p className="subtitle">Memuat...</p>;

  const baseUrl = docs.base_url;
  const curlExample = `curl -X POST "${baseUrl}/api/react" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"${url || 'https://whatsapp.com/channel/XXXX/YYYY'}","reaction":"${reaction || '👍'}"}'`;

  const fetchExample = `const res = await fetch("${baseUrl}/api/react", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "${url || 'https://whatsapp.com/channel/XXXX/YYYY'}",
    reaction: "${reaction || '👍'}"
  })
});
const data = await res.json();
console.log(data);`;

  const jsExample = `const axios = require("axios");

const { data } = await axios.post("${baseUrl}/api/react", {
  url: "${url || 'https://whatsapp.com/channel/XXXX/YYYY'}",
  reaction: "${reaction || '👍'}"
});
console.log(data);`;

  const code = { curl: curlExample, fetch: fetchExample, node: jsExample }[tab];

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <>
      <h1 className="title">API</h1>
      <p className="subtitle">
        Endpoint publik — bisa dipanggil dari aplikasi lain.
      </p>

      {/* Endpoint info */}
      <div className="doc-item">
        <h3>{docs.endpoint.name}</h3>
        <span className="method">{docs.endpoint.method} {docs.endpoint.path}</span>
        <p>{docs.endpoint.description}</p>

        <div className="label">Full URL</div>
        <div className="copy-row">
          <code>{baseUrl}{docs.endpoint.path}</code>
          <button className="mini" onClick={() => copy(baseUrl + docs.endpoint.path)}>Copy</button>
        </div>

        <div className="label">Body</div>
        <pre>{JSON.stringify(docs.endpoint.body, null, 2)}</pre>
      </div>

      {/* Playground */}
      <div className="doc-item">
        <h3>Playground</h3>
        <p>Test langsung dari sini.</p>

        <form className="form" onSubmit={run}>
          <div className="field">
            <label>URL Channel</label>
            <input
              type="text"
              placeholder="https://whatsapp.com/channel/XXXX/YYYY"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Emoji</label>
            <input
              type="text"
              placeholder="👍 atau 💦,👍"
              value={reaction}
              onChange={(e) => setReaction(e.target.value)}
              required
            />
          </div>
          <button className="btn" disabled={loading}>
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>

        {result && (
          <pre className={`result ${result.status ? 'ok' : 'err'}`}>
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      {/* Code examples */}
      <div className="doc-item">
        <h3>Contoh Request</h3>
        <div className="tabs">
          <button className={tab === 'curl' ? 'active' : ''} onClick={() => setTab('curl')}>cURL</button>
          <button className={tab === 'fetch' ? 'active' : ''} onClick={() => setTab('fetch')}>Fetch</button>
          <button className={tab === 'node' ? 'active' : ''} onClick={() => setTab('node')}>Node</button>
        </div>
        <pre>{code}</pre>
        <button className="mini" onClick={() => copy(code)}>Copy Code</button>
      </div>

      {/* Responses */}
      <div className="doc-item">
        <h3>Response</h3>
        <div className="label">Success</div>
        <pre>{JSON.stringify(docs.endpoint.response_success, null, 2)}</pre>
        <div className="label">Error</div>
        <pre>{JSON.stringify(docs.endpoint.response_error, null, 2)}</pre>
      </div>

      {/* Notes */}
      <div className="doc-item">
        <h3>Catatan</h3>
        <ul style={{ paddingLeft: 20, color: '#888', fontSize: 13, lineHeight: 1.9 }}>
          {docs.notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </div>
    </>
  );
}
