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

walker.on('file', (path, stats, next) => {
  console.log(`File: ${path}/${stats.name}`);
  next();
});

walker.on('errors', (path, stats, next) => {
  console.log(`Error from file ${path}/${stats.name}`);
  next();
});

walker.on('end', () => {
  console.log("Done.");
});

