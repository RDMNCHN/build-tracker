export const config = { runtime: 'edge' }

export default async function handler(req) {
  const { searchParams } = new URL(req.url)
  const exerciseId = searchParams.get('id')
  if (!exerciseId) return new Response('Missing id', { status: 400 })

  const res = await fetch(
    `https://exercisedb.p.rapidapi.com/image?exerciseId=${exerciseId}&resolution=360`,
    { headers: {
      'x-rapidapi-key': '97f87cf90amsh539c733e15b2ba7p176d29jsn4b747e8f34a6',
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }}
  )
  const blob = await res.arrayBuffer()
  return new Response(blob, {
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'public, max-age=31536000',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
