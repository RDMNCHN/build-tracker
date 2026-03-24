// Web Push without external library - using native crypto
async function signJWT(header, payload, privateKey) {
  const encoder = new TextEncoder()
  const data = `${btoa(JSON.stringify(header)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}.${btoa(JSON.stringify(payload)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}`
  const key = await crypto.subtle.importKey('pkcs8', base64ToBuffer(privateKey), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, encoder.encode(data))
  const sigB64 = bufferToBase64url(sig)
  return `${data}.${sigB64}`
}

function base64ToBuffer(b64) {
  const binary = atob(b64.replace(/-/g,'+').replace(/_/g,'/'))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
}

async function sendWebPush(subscription, payload, vapidPublic, vapidPrivate) {
  const endpoint = subscription.endpoint
  const origin = new URL(endpoint).origin
  const now = Math.floor(Date.now() / 1000)

  const jwt = await signJWT(
    { typ: 'JWT', alg: 'ES256' },
    { aud: origin, exp: now + 86400, sub: 'mailto:admin@grindset.app' },
    vapidPrivate
  )

  const authHeader = `vapid t=${jwt},k=${vapidPublic}`

  // Encrypt payload
  const encoder = new TextEncoder()
  const payloadBytes = encoder.encode(JSON.stringify(payload))

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400'
    },
    body: payloadBytes
  })

  return response
}

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY
  const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), { status: 500 })
  }

  const { subscriptions, title, body } = await req.json()
  if (!subscriptions?.length) return new Response(JSON.stringify({ sent: 0, failed: 0 }), { status: 200 })

  const payload = { title: title || 'Grindset', body: body || '', icon: '/icon-192.png' }

  const results = await Promise.allSettled(
    subscriptions.map(sub => sendWebPush(sub, payload, VAPID_PUBLIC, VAPID_PRIVATE))
  )

  const sent = results.filter(r => r.status === 'fulfilled' && r.value?.ok).length
  const failed = results.length - sent

  return new Response(JSON.stringify({ sent, failed }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  })
}

export const config = { runtime: 'edge' }
