#!/usr/bin/env node
console.log("ranch-upload v0.0.1");

require("dotenv").config()
const fs       = require("fs");
const PATH     = require("path");
const mkdirp   = require("mkdirp");
const upload   = require("./lib/upload");
const compress = require("./lib/compress");
const chokidar = require("chokidar");

const TMP_DIR = "tmp";
//const FOOTAGE_DIRECTORY = "/tmp/samples";
//const FOOTAGE_DIRECTORY = 'M:\MediaDatabase';
const FOOTAGE_DIRECTORY = "MediaDatabase";

console.log("dependencies loaded.");

// start processing files
READY = false;
chokidar.watch(FOOTAGE_DIRECTORY, {ignored: /(^|[\/\\])\../})
  .on("ready", () => {
      READY = true;
      console.log("ready.");
  })
  .on("add", path => {
      if (READY && path.endsWith("_1"))
          process(path);
  });

async function process(path) {
    console.log("new file: " + path);

    let root =
        FOOTAGE_DIRECTORY[FOOTAGE_DIRECTORY.length-1] == "/"
        ? FOOTAGE_DIRECTORY.slice(0, FOOTAGE_DIRECTORY.length-1)
        : FOOTAGE_DIRECTORY;

    mkdirp.sync(TMP_DIR);
    const dbx_path = path.replace(root, "").replace("pic", "mp4");
    mkdirp.sync(PATH.dirname(TMP_DIR + dbx_path));

    await compress(path, TMP_DIR + dbx_path);
    await upload.clip(TMP_DIR + dbx_path, dbx_path);
    fs.unlink(TMP_DIR + dbx_path, function() {
        console.log("removed: " + TMP_DIR + dbx_path);
    });
}
