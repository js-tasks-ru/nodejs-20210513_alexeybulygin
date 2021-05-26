const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.includes('/')) {
        res.writeHead(400, 'Not allowed')
        res.end()
        return
      }

      const readStream = fs.createReadStream(filepath)

      readStream.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.writeHead(404, err.message)
          res.end(err.message)
          return
        }

        res.writeHead(500, err.message)
        res.end(err.message)
      })

      readStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
