import axios from 'axios';

const API_ENDPOINT = 'https://apiv2.reactionwa.online/api/v2/react';
const GEN_KEY_ENDPOINT = 'https://apiv2.reactionwa.online/api/v2/generate_key';
const FIREBASE_API_KEY = 'AIzaSyDNbAlgLycK0oRO8I9ja3mPnIccZkOz0M0';
const RTDB_URL = 'https://autoreactberry-default-rtdb.asia-southeast1.firebasedatabase.app/api_keys.json';

const LINK_REGEX = /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([A-Za-z0-9_-]+)\/(\d+)/i;
const EMOJI_REGEX = /\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?/gu;

const VIP_CREDENTIALS = {
  'VIP-SYNOZG8C': { email: 'abovezephyrax@gmail.com', uid: 'syNOzg8C4dfMq8CwnE0inNDNdwn1' },
  'VIP-D68JICP0': { email: 'pribadiarep@gmail.com', uid: 'n6eaa7vLSWdexXeCzDnThjqxHps1' },
  'VIP-G3FA579P': { email: 'berrymodapk@gmail.com', uid: 'G3FA579Px5MLiC4zISunSqergX43' },
  'VIP-H9PQGDBA': { email: 'kenznan123@gmail.com', uid: 'h9PQgdbApBWe1E3p3ZXffnpWOdm1' },
  'VIP-VIP-D68J': { email: 'pribadiarep@gmail.com', uid: 'VIP-D68JICPO' }
};

const DEFAULT_VIP_KEYS = [
  { name: 'VIP-SYNOZG8C', apiKey: 'BERRY-RCH-XLedTFORQjE0o05upBSBjMhFLyJzA+ZgINzUpnhbQal+Vl0TdTCWhEyR1i7aCFD97C9dPvs7ZAOTkljWouUmpDplbLNpaloI7ybxoXm95mT4To14487VOag=', domain: 'https://mytestdomain.com' },
  { name: 'VIP-G3FA579P', apiKey: 'BERRY-RCH-s488dmV/Im9CYK9RksIKzHB+PKpqxaGBeDje9boybZoMiEoWLc1EmGG2TA9yTgBOCa9RT56a35exUMwqJG06QTO39LJvF7IWZCVq3FKzME50TUNgJH4=', domain: 'https://berrymodapk.com' },
  { name: 'VIP-VIP-D68J', apiKey: 'BERRY-RCH-UF0CX6Lc+ncL7W/kQldo2v+uKbXtjyqhRg6z/u/GJaoL41jILpCerrfSFQBGLSZnNqHvFrIJ5bnOnDTd2K102CgMulKWZfxGbeo/Fmf9Pi4w2mySyBf5dLAnaw==', domain: 'https://reactv2.zfile.web.id' },
  { name: 'VIP-D68JICP0', apiKey: 'BERRY-RCH-Eu3fhllDTNViiwl8dFcVKfMnJUzSt/UFLTftJ/sZJgPy/nCC3Y7JO+83gJLLhicfp+SEEhfruPHhIE3vJrr0oU5mhEfpa2GcBcC4A/GV9VaInumRoLsmSLjBskNQyVE=', domain: 'https://api.rech.v2.zfile.web.id' },
  { name: 'VIP-H9PQGDBA', apiKey: '5XJr5CoEvcwn6Akmx4TvQPV+ybnaa7VAn8OUYdociEXLS2l06kPypNMFhz5eMExSxrq+/mHz8sOu/5k44dEB016L/QJ3QZpPuYbDiSdpxlVTOR6a14P295M8lQrmMrj0YLJmmne1sQ+1YGhCKSg=', domain: 'https://anzzmodsofficial.edgeone.dev/reaction/wa' }
];

// In-memory state (per serverless instance)
let state = {
  keyIndex: 0,
  keys: [...DEFAULT_VIP_KEYS],
  lastSync: 0
};

/* -------------------- Helpers -------------------- */

function normalizeUrl(input) {
  const m = String(input || '').match(LINK_REGEX);
  return m ? `https://whatsapp.com/channel/${m[1]}/${m[2]}` : null;
}

function parseEmojis(input) {
  const matches = String(input || '').match(EMOJI_REGEX);
  return matches && matches.length ? matches.slice(0, 5).join(', ') : null;
}

async function generateVipApiKey(vipKeyName, targetDomain) {
  const cred = VIP_CREDENTIALS[vipKeyName];
  if (!cred) return null;
  try {
    const res = await axios.post(
      GEN_KEY_ENDPOINT,
      { vipKey: vipKeyName, email: cred.email, domain: targetDomain, uid: cred.uid },
      { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
    );
    if (res.data && res.data.success && res.data.apiKey) return res.data.apiKey;
  } catch {}
  return null;
}

async function syncVipKeys() {
  try {
    const authRes = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
      { returnSecureToken: true },
      { headers: { Referer: 'https://reactionwa.online/' }, timeout: 10000 }
    );
    const idToken = authRes.data && authRes.data.idToken;
    if (!idToken) return null;

    const dbRes = await axios.get(`${RTDB_URL}?auth=${idToken}`, { timeout: 10000 });
    if (!dbRes.data || typeof dbRes.data !== 'object') return null;

    const freshKeys = [];
    for (const [name, val] of Object.entries(dbRes.data)) {
      if (!val || val.active === false) continue;
      let domain = val.domain || 'https://reactionwa.online';
      let apiKey = val.apiKey;
      if (domain === '*' || !apiKey) {
        domain = 'https://mytestdomain.com';
        const genKey = await generateVipApiKey(name, domain);
        if (genKey) apiKey = genKey;
      }
      if (apiKey) freshKeys.push({ name, apiKey, domain });
    }

    if (freshKeys.length > 0) {
      state.keys = freshKeys;
      state.lastSync = Date.now();
      return freshKeys;
    }
  } catch {}
  return null;
}

async function sendReactionRequest(targetUrl, reactionText, keyObj) {
  const origin = keyObj.domain === '*' ? 'https://reactionwa.online' : keyObj.domain;
  const referer = origin.endsWith('/') ? origin : origin + '/';

  const response = await axios.post(
    API_ENDPOINT,
    { url: targetUrl, reaction: reactionText },
    {
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
        Referer: referer,
        'x-api-key': keyObj.apiKey,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
      },
      timeout: 45000
    }
  );

  return response.data;
}

/* -------------------- Handler -------------------- */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({
      Creator: 'AlcaW44',
      Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
      status: false,
      error: 'Method not allowed. Gunakan POST.'
    });
  }

  const startTime = Date.now();
  const body = req.body || {};
  const url = body.url;
  const reaction = body.reaction;

  // Validasi URL
  const normalizedUrl = normalizeUrl(url);
  if (!normalizedUrl) {
    return res.json({
      Creator: 'AlcaW44',
      Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
      time: `${Date.now() - startTime}ms`,
      status: false,
      error: 'Format URL WhatsApp Channel tidak valid. Contoh: https://whatsapp.com/channel/0029VbDyL6d9RZAh3JjEM325/158'
    });
  }

  // Validasi emoji
  const emojiString = parseEmojis(reaction);
  if (!emojiString) {
    return res.json({
      Creator: 'AlcaW44',
      Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
      time: `${Date.now() - startTime}ms`,
      status: false,
      error: 'Emoji tidak valid. Masukkan minimal 1 emoji (contoh: "👍" atau "💦,👍").'
    });
  }

  // Sync VIP keys dari Firebase (maks 1x per 5 menit per instance)
  if (Date.now() - state.lastSync > 5 * 60 * 1000) {
    await syncVipKeys();
  }

  if (!state.keys || state.keys.length === 0) {
    state.keys = DEFAULT_VIP_KEYS;
  }

  let attempts = 0;
  const maxAttempts = state.keys.length;
  let lastError = 'Semua VIP key gagal memproses request. Coba lagi beberapa saat.';

  while (attempts < maxAttempts) {
    const currentKey = state.keys[state.keyIndex % state.keys.length];
    state.keyIndex = (state.keyIndex + 1) % state.keys.length;

    try {
      const result = await sendReactionRequest(normalizedUrl, emojiString, currentKey);

      if (result && (result.success === true || result.status === 'success')) {
        const task = (result.data && result.data.task) || {};
        const vipInfo = (result.data && result.data.vip) || {};

        return res.json({
          Creator: 'AlcaW44',
          Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
          time: `${Date.now() - startTime}ms`,
          status: true,
          message: result.message || 'Reaction VIP API masuk antrean.',
          data: {
            task_id: task.key_id || null,
            target: normalizedUrl,
            emojis: task.reaction_code || emojiString,
            vip_key: currentKey.name,
            vip_package: vipInfo.packageName || 'VIP Permanent',
            usage_today: result.usage_today ?? null,
            points_remaining: vipInfo.pointRemaining ?? null
          }
        });
      }

      if (result && result.error) {
        lastError = `[${currentKey.name}] ${result.error}`;
      }
    } catch (err) {
      const errData = err.response && err.response.data;
      lastError = errData && errData.error
        ? `[${currentKey.name}] ${errData.error}`
        : (err.message || 'Terjadi kesalahan pada server');
    }

    attempts++;
  }

  return res.json({
    Creator: 'AlcaW44',
    Saluran: 'https://whatsapp.com/channel/0029Vb82nkLEwEjtLSQ49I44',
    time: `${Date.now() - startTime}ms`,
    status: false,
    error: lastError
  });
}
