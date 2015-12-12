require("log-a-log");

const _ = require("lodash");
const fs = require("fs");
const os = require("os");
const exif = require("exif");
const walk = require("walk");
const async = require("async");
const tingodb = require("tingodb");

var home = os.homedir();
var imageDir = `${home}/Pictures`;

var walker = walk.walk(imageDir);

walker.on('file', (path, stats, next) => {
  console.log(`File: ${path}/${stats.name}`);
});

walker.on('errors', (path, stats, next) => {
  console.log(`Error from file ${path}/${stats.name}`);
});

walker.on('end', () => {
  console.log("Done.");
});

