const fs       = require("fs");
const PATH     = require("path");

const FOOTAGE_DIRECTORY = PATH.join("E:", "MediaDatabase");

var chokidar = require('chokidar');

chokidar.watch('../MediaDatabase', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
  console.log(event, path);
});
