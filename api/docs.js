export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  res.json({
    status: true,
    creator: 'AlcaW44',
    channel: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
    base_url: 'https://' + (req.headers.host || 'your-domain.vercel.app'),
    endpoint: {
      name: 'React',
      method: 'POST',
      path: '/api/react',
      description: 'Kirim reaction ke post WhatsApp Channel',
      body: {
        url: 'https://whatsapp.com/channel/XXXX/YYYY',
        reaction: '👍'
      },
      response_success: {
        Creator: 'AlcaW44',
        Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
        time: '1234ms',
        status: true,
        message: 'Reaction VIP API masuk antrean.',
        data: {
          task_id: 'abc123',
          target: 'https://whatsapp.com/channel/...',
          emojis: '👍',
          vip_key: 'VIP-XXXX',
          vip_package: 'VIP Permanent',
          usage_today: 5,
          points_remaining: 100
        }
      },
      response_error: {
        Creator: 'AlcaW44',
        Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
        time: '800ms',
        status: false,
        error: 'Format URL WhatsApp Channel tidak valid.'
      }
    },
    notes: [
      'Maksimal 5 emoji per request (dipisah koma: 💦,👍)',
      'URL harus format: https://whatsapp.com/channel/{id}/{post_id}',
      'Bisa dipanggil dari aplikasi lain via POST request'
    ]
  });
}
