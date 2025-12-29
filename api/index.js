import http from 'node:http'

const PORT = process.env.PORT || 4000

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      message: 'ThriftKos API berjalan',
      db: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || '3306',
        name: process.env.DB_NAME || 'thrift_db',
      },
    })
  )
})

server.listen(PORT, () => {
  console.log(`ThriftKos API listening on http://localhost:${PORT}`)
})
