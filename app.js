#!/usr/bin/env node
console.log("ranch-upload v0.0.1");

require("dotenv").config()
const fs       = require("fs");
const PATH     = require("path");
const mkdirp   = require("mkdirp");
const upload   = require("./lib/upload");
const compress = require("./lib/compress");
const chokidar = require("chokidar");
console.log("dependencies loaded.");

const TMP_DIR = "tmp";
const FOOTAGE_GLOB = "/MediaDatabase/*_1/**/*.pic";
console.log("footage_glob: " + FOOTAGE_GLOB);

// start processing files
READY = false;
chokidar.watch(FOOTAGE_GLOB, {
    usePolling: true,
    ignoreInitial: true
})
  .on("ready", () => {
      READY = true;
      console.log("ready.");
  })
  .on("add", path => {
      if (READY)
          process(path);
  });

async function process(path) {
    console.log("new file: " + path);

    mkdirp.sync(TMP_DIR);
    const dbx_path = path.replace("pic", "mp4").replace("\\", "/");
    console.log("dBX PATH", dbx_path);
    const tmp_encode = PATH.join(TMP_DIR, dbx_path);

    mkdirp.sync(PATH.dirname(tmp_encode));

    await compress(path, tmp_encode);
    await upload.clip(tmp_encode, dbx_path);
    fs.unlink(tmp_encode, function() {
        console.log("removed: " + tmp_encode);
    });
}
