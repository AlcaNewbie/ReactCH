export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: true,
    creator: 'AlcaW44',
    channel: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
    endpoints: [
      {
        name: 'React',
        method: 'POST',
        path: '/api/react',
        description: 'Mengirim reaction ke post WhatsApp Channel',
        body: {
          url: 'https://whatsapp.com/channel/XXXX/YYYY',
          reaction: '👍'
        },
        response: {
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
            limit: 50,
            points_remaining: 100
          }
        }
      }
    ],
    notes: [
      'Maksimal 5 emoji per request',
      'URL harus format: https://whatsapp.com/channel/{id}/{post_id}',
      'Limit harian per VIP key: 50 request'
    ]
  });
}
