const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.encoding = options.encoding
    this.chunkTail = ''
  }

  _transform(chunk, encoding, callback) {
    const chunkElements = Buffer.from(chunk, this.encoding).toString().split(os.EOL)

    if (chunkElements.length > 1) {
      chunkElements.forEach((item, index, array) => {
        if (index === 0) {
          this.push(this.chunkTail + item)
          return
        }

        if (index === array.length - 1) {
          this.chunkTail = [...array].pop()
          return
        }

        this.push(item)
      })
    } else {
      this.chunkTail += chunkElements[0]
    }

    callback()
  }

  _flush(callback) {
    callback(null, this.chunkTail);
  }
}

module.exports = LineSplitStream;
