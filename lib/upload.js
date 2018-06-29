require("isomorphic-fetch");
const fs = require("fs");
const Dropbox = require("dropbox").Dropbox;
const dbx = new Dropbox({accessToken: process.env.DROPBOX_ACCESS_TOKEN});

module.exports.clip = function(src, dst) {
    return dbx.filesUpload({
        path: dst,
        mode: "overwrite",
        contents: fs.createReadStream(src)
    }).then(function() {
        console.log("upload complete: " + src);
    }).catch(err => console.log(err));
}

module.exports.test = function() {
    const input_text = (new Date()).toLocaleString();
    
    return dbx.filesUpload({
        path: "/hello.txt",
        mode: "overwrite",
        contents: input_text
    }).then(res => {
        console.log(res);
        return dbx.filesDownload({path: "/hello.txt"});
    }).then(res => {
        const received_text = String(res.fileBinary);

        if (received_text == input_text)
            return true;
        else
            throw new Error("text mismatch");
    }).catch(err => {
        console.log(err);
        return err;
    });
}
