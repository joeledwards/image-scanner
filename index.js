require("log-a-log");

const _ = require("lodash");
const async = require("async");
const crypto = require("crypto");
const durations = require("durations");
const exif = require("exif");
const fs = require("fs");
const os = require("os");
const tingodb = require("tingodb");
const walk = require("walk");

const concurrency = 2;

var home = os.homedir();
var imageDir = `${home}/Pictures`;

var watch = durations.stopwatch().start();
var totalWatch = durations.stopwatch().start();
var queued = 0;
var processed = 0;

function sha256sum (path, callback) {
  var hash = crypto.createHash('sha256');
  var stream = fs.ReadStream(path);

  stream.on('error', (error) => callback(error));
  stream.on('data', (data) => hash.update(data));
  stream.on('end', () => callback(undefined, hash.digest('hex')));
}

function fileHandler (path, stats, next) {
  var file = `${path}/${stats.name}`;
  sha256sum(file, (error, digest) => {
    if (error) {
      console.error(`Error getting SHA-256 digest of ${file}: ${error}`);
    }
    else {
      processed++;
      if (watch.duration().millis() >= 1000) {
        console.log(`${processed} files in ${totalWatch}`);
        console.log(`${queue.length()} files remaining in the queue.`);
        watch.reset().start();
      }
      //console.log(`[${digest}] ${file}`);
    }

    next();
  })
}

function worker (task, done) {
  var path = task.path;
  var stats = task.stats;
  var next = task.next;

  fileHandler(path, stats, done);
}

var queue = async.queue(worker, concurrency);

var walker = walk.walk(imageDir);

walker.on('file', (path, stats, next) => {
  queue.push({ path: path, stats: stats });
  queued++;
  next();
});

walker.on('errors', (path, stats, next) => {
  console.log(`Error from file ${path}/${stats.name}`);
  next();
});

walker.on('end', () => {
  console.log(`Done. Queued ${queued} files.`);
});

