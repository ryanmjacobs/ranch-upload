const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");

module.exports = function(src, dst) {
    const date = fs.statSync(src).ctime;
    const date_str = date.toLocaleString().replace(/:/g, "\\:");

    return new Promise((resolve, reject) => {
        const command = ffmpeg(src)
          .on("end",    () => {
              console.log("encode complete: " + src)
              resolve();
          })
          .on("error", err => {
              console.log(`ffmpeg error (${src}): ${err.message}`)
              reject(err);
          })

          .videoFilter(
              `drawtext="fontfile=SourceSansPro.ttf:fontsize=200:` +
              `fontcolor=yellow:box=1:boxcolor=black@0.8:text='${date_str}'`)
          .size("?x240")
          .save(dst);
    })
}
