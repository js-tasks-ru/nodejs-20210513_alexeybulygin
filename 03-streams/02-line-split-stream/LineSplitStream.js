const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding
  }

  _transform(chunk, encoding, callback) {
    Buffer
      .from(chunk, this.encoding)
      .toString()
      .split(os.EOL)
      .forEach(part => {
        this.push(part)
      });

    callback(null);
  }

  _flush(callback) {
    callback(null);
  }
}

module.exports = LineSplitStream;
