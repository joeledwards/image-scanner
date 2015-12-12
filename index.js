require("log-a-log");

const _ = require("lodash");
const async = require("async");
const crypto = require("crypto");
const exif = require("exif");
const fs = require("fs");
const os = require("os");
const tingodb = require("tingodb");
const walk = require("walk");

var home = os.homedir();
var imageDir = `${home}/Pictures`;

var walker = walk.walk(imageDir);

function sha256sum (path, callback) {
  var hash = crypto.createHash('sha256');
  var stream = fs.ReadStream(path);

  stream.on('error', (error) => callback(error));
  stream.on('data', (data) => hash.update(data));
  stream.on('end', () => callback(undefined, hash.digest('hex')));
}

walker.on('file', (path, stats, next) => {
  var file = `${path}/${stats.name}`;
  sha256sum(file, (error, digest) => {
    if (error) {
      console.error(`Error getting SHA-256 digest of ${file}`);
    }
    else {
      console.log(`[${digest}] ${file}`);
      next();
    }
  })
});

walker.on('errors', (path, stats, next) => {
  console.log(`Error from file ${path}/${stats.name}`);
  next();
});

walker.on('end', () => {
  console.log("Done.");
});

