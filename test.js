const fs       = require("fs");
const PATH     = require("path");
const chokidar = require("chokidar");

const FOOTAGE_DIRECTORY = PATH.join("E:", "MediaDatabase");

READY = false;
chokidar.watch(FOOTAGE_DIRECTORY, {ignored: /(^|[\/\\])\../})
  .on("ready", () => {
      READY = true;
      console.log("ready.");
  })
  .on("add", path => {
      console.log(path);
      if (READY && path.includes("_1" + PATH.sep))
          console.log("GOOD", path);
  });
