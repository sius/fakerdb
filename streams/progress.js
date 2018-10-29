var { Transform } = require('stream')
  , progress = require('cli-progress')
  , colors = require('colors');

const DEFAULT_PRESETS = Object.assign(progress.Presets.shades_classic, {
  format: colors.green(' {bar}') + ' {percentage}% | ETA: {eta_formatted} | {value}/{total} | Duration: {duration_formatted}',
});
function createPresets(color) {
  if (!color) {
    return DEFAULT_PRESETS;
  }
  return Object.assign(progress.Presets.shades_classic, {
    format: colors[color](' {bar}') + ' {percentage}% | ETA: {eta_formatted} | {value}/{total} | Duration: {duration_formatted}',
  });
}

module.exports = function(options = null, cb = null) {

  let color = 'green';
  if (options.progress && options.progress.bar && options.progress.bar.color) {
    color = options.progress.bar.color;
  }
  let bar = new progress.Bar({}, createPresets(color))
    , total = options.replay || 1
    , n = 0;
    
  bar.start(total, 0);

  return new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
      bar.update(++n);
      if (n == total) {
        bar.stop()
        if (cb) {
          cb()
        }
      }
      callback();
    }
  });
}
