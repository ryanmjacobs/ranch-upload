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
const FOOTAGE_GLOB = "\\MediaDatabase\\**\\*.pic";
console.log("footage_glob: " + FOOTAGE_GLOB);

// start processing files
READY = false;
chokidar.watch(FOOTAGE_GLOB, {ignored: /(^|[\/\\])\../})
  .on("ready", () => {
      READY = true;
      console.log("ready.");
  })
  .on("add", path => {
      console.log(path);
    //if (READY)
    //    process(path);
  });

async function process(path) {
    console.log("new file: " + path);

    mkdirp.sync(TMP_DIR);
    const dbx_path = path.replace(FOOTAGE_DIRECTORY, "").replace("pic", "mp4");
    mkdirp.sync(PATH.dirname(TMP_DIR + dbx_path));

    await compress(path, TMP_DIR + dbx_path);
    await upload.clip(TMP_DIR + dbx_path, dbx_path);
    fs.unlink(TMP_DIR + dbx_path, function() {
        console.log("removed: " + TMP_DIR + dbx_path);
    });
}
