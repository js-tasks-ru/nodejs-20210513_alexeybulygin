const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit
    this.encoding = options.encoding

    this.readed = 0
  }

  _transform(chunk, encoding, callback) {
    const chunkLength = Buffer.byteLength(chunk, this.encoding)

    if ((this.readed + chunkLength) > this.limit) {
      const error = new LimitExceededError()
      callback(error, chunk)
      return
    }

    this.readed += chunkLength
    callback(null, chunk)
  }
}

module.exports = LimitSizeStream;
