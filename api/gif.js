export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const search = searchParams.get('search')
  const list = searchParams.get('list')
  const offset = searchParams.get('offset') || '0'
  const limit = searchParams.get('limit') || '500'
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '97f87cf90amsh539c733e15b2ba7p176d29jsn4b747e8f34a6'

  const headers = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
  }

  // List all exercises (for bulk import)
  if (list) {
    const url = `https://exercisedb.p.rapidapi.com/exercises?limit=${limit}&offset=${offset}`
    const res = await fetch(url, { headers })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=86400' }
    })
  }

  // Search by name
  if (search) {
    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(search)}?limit=15`
    const res = await fetch(url, { headers })
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=86400' }
    })
  }

  // Fetch single exercise GIF by ID
  if (!id) return new Response('Missing param', { status: 400 })
  const exerciseRes = await fetch(`https://exercisedb.p.rapidapi.com/exercises/exercise/${id}`, { headers })
  const exercise = await exerciseRes.json()
  if (!exercise?.gifUrl) return new Response('Not found', { status: 404 })

  const gifRes = await fetch(exercise.gifUrl)
  const blob = await gifRes.arrayBuffer()
  return new Response(blob, {
    status: 200,
    headers: { 'Content-Type': 'image/gif', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=604800' }
  })
}

export const config = { runtime: 'edge' }
