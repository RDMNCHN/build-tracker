export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const search = searchParams.get('search')
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '97f87cf90amsh539c733e15b2ba7p176d29jsn4b747e8f34a6'

  // Search mode
  if (search) {
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(search)}?limit=15`
    const res = await fetch(url, {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  }

  // GIF mode
  if (!id) return new Response('Missing id or search', { status: 400 })
  const gifUrl = `https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`
  const res = await fetch(gifUrl, {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    }
  })
  const exercise = await res.json()
  if (!exercise?.gifUrl) return new Response('Not found', { status: 404 })

  // Proxy the actual GIF
  const gifRes = await fetch(exercise.gifUrl)
  const blob = await gifRes.arrayBuffer()
  return new Response(blob, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=604800'
    }
  })
}

export const config = { runtime: 'edge' }
