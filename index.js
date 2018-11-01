
const { replay, jsf, insert, progress } = require('./streams');

function generate(db, schema, options = null, cb = null ) {

  let opts = options || { replay: 1, insert: { blockSize: 1 } };

  replay(schema, opts)
    .pipe(jsf(opts))
    .pipe(insert(db, opts))
    .pipe(progress(opts, cb));
}

module.exports = {
  jsf: jsf,
  replay: replay,
  insert: insert,
  progress: progress,
  generate: generate
};
