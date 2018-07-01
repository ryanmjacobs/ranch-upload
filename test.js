const fs       = require("fs");
const PATH     = require("path");

const FOOTAGE_DIRECTORY = PATH.join("E:", "MediaDatabase");

fs.watch(FOOTAGE_DIRECTORY, {persistent: true}, function (event, filename) {
    console.log(`${event} - ${filename}`);
});
