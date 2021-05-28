const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/')) {
        res.writeHead(400, 'Not allowed')
        res.end()
        return
      }

      const limitSize = new LimitSizeStream({limit: 1048576})
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'})

      req
        .pipe(limitSize)
        .on('error', (err) => {
          if (err.code === 'LIMIT_EXCEEDED') {
            fs.unlink(filepath, (err) => {})
            res.statusCode = 413
            // res.setHeader('Connection', 'close')
            res.end(err.message)
            return
          }

          res.writeHead(500, err.message)
          res.end(err.message)
        })

        .pipe(writeStream)
        .on('error', (err) => {
          if (err.code === 'EEXIST') {
            res.writeHead(409, err.message)
            res.end(err.message)
            return
          }

          res.writeHead(500, err.message)
          res.end(err.message)
        })

        .on('finish', () => {
          res.writeHead(201)
          res.end()
          return
        })

      writeStream.on('aborted', () => {
        fs.unlink(filepath, (err) => {})
        writeStream.destroy()
      })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
