const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error al manejar la petición', req.url, err)
      res.statusCode = 500
      res.end('Error interno del servidor')
    }
  })
    .once('error', (err) => {
      console.error('Error iniciando el servidor:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Listo en http://${hostname}:${port}`)
    })
})
