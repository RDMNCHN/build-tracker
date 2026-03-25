const https = require('https')

module.exports = async function handler(req, res) {
  const id = req.query.id
  const search = req.query.search
  const list = req.query.list
  const offset = req.query.offset || '0'
  const limit = req.query.limit || '10'
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '97f87cf90amsh539c733e15b2ba7p176d29jsn4b747e8f34a6'

  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    if (list) {
      const data = await rapidFetch(`/exercises?limit=${limit}&offset=${offset}`, RAPIDAPI_KEY)
      return res.status(200).json(data)
    }
    if (search) {
      const data = await rapidFetch(`/exercises/name/${encodeURIComponent(search)}?limit=15`, RAPIDAPI_KEY)
      return res.status(200).json(data)
    }
    if (!id) return res.status(400).json({ error: 'Missing id' })
    const exercise = await rapidFetch(`/exercises/exercise/${id}`, RAPIDAPI_KEY)
    if (!exercise?.gifUrl) return res.status(404).json({ error: 'No GIF found' })
    const gifData = await fetchBinary(exercise.gifUrl)
    res.setHeader('Content-Type', 'image/gif')
    res.setHeader('Cache-Control', 'public, max-age=604800')
    return res.status(200).send(gifData)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

function rapidFetch(path, key) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'exercisedb.p.rapidapi.com',
      path, method: 'GET',
      headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com' }
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch(e) { reject(new Error('Invalid JSON')) } })
    })
    req.on('error', reject)
    req.end()
  })
}

function fetchBinary(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    }).on('error', reject)
  })
}
