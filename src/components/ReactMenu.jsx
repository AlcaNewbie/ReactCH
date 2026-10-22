import { useState } from 'react';

export default function ReactMenu() {
  const [url, setUrl] = useState('');
  const [reaction, setReaction] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/react', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, reaction })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ status: false, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="title">React Channel</h1>
      <p className="subtitle">Kirim reaction ke post WhatsApp Channel.</p>

      <form className="form" onSubmit={submit}>
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
          <label>Emoji (max 5, pisahkan koma)</label>
          <input
            type="text"
            placeholder="👍 atau 💦,👍"
            value={reaction}
            onChange={(e) => setReaction(e.target.value)}
            required
          />
        </div>
        <button className="btn" disabled={loading}>
          {loading ? 'Mengirim...' : 'Kirim Reaction'}
        </button>
      </form>

      {result && (
        <pre className={`result ${result.status ? 'ok' : 'err'}`}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </>
  );
}
