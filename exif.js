require('log-a-log');

const _ = require('lodash');
const exif = require('exif');
const ExifImage = exif.ExifImage;

var file = _(process.argv).last();

console.log(`File is ${file}`);

try {
  new ExifImage({image: file}, (error, data) => {
    if (error) {
      console.log(`Error fetching exif data: ${error}`);
    } else {
      console.log(`EXIF data for ${file} :`)
      console.log(JSON.stringify(data, null, 2));
    }
  });
} catch (error) {
  console.log(`Error reading image file: ${error}`);
}

