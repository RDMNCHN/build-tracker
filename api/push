import webpush from 'web-push'

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY
  const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return new Response(JSON.stringify({ error: 'VAPID keys not configured' }), { status: 500 })
  }

  webpush.setVapidDetails('mailto:admin@grindset.app', VAPID_PUBLIC, VAPID_PRIVATE)

  const { subscriptions, title, body, icon } = await req.json()
  if (!subscriptions?.length) return new Response(JSON.stringify({ error: 'No subscriptions' }), { status: 400 })

  const payload = JSON.stringify({
    title: title || 'Grindset',
    body: body || '',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png'
  })

  const results = await Promise.allSettled(
    subscriptions.map(sub => webpush.sendNotification(sub, payload))
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

  return new Response(JSON.stringify({ sent, failed }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const config = { runtime: 'edge' }
