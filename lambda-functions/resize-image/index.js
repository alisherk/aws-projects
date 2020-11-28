const im = require('imagemagick');
const fs = require('fs');
const os = require('os');
const { promisify } = require('util');
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ca-central-1' });
const s3 = new AWS.S3();

const resizeAsync = promisify(im.resize);
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(fs.unlink);

exports.handler = async (event, context) => {
  const filesProssed = event.Records.map(async (record) => {
    let bucket = record.s3.bucket.name;
    let filename = record.s3.object.key;

    //get file from s3
    const params = {
      Bucket: bucket,
      key: filename,
    };
    const inputData = await s3.getObject(params).promise();
    //resize file
    let tempFile = os.tmpdir() + '/' + Math.random() + '.jpg';

    let resizeArgs = {
      srcData: inputData.Body,
      dstPath: tempFile,
      width: 150,
    };
    await resizeAsync(resizeArgs);

    //read the resized file
    let resizedData = await readFileAsync(tempFile);

    let targetFileName =
      filename.substring(0, filename.lastIndexOf('.')) + '-small.jpg';

    const destParams = {
      Bucket: bucket + '-dest',
      Key: targetFileName,
      Body: new Buffer(resizedData),
      ContentType: 'image/jpeg',
    };
    await s3.putObject(destParams).promise();
    return await unlinkAsync(tempFile);
  });
  await Promise.all(filesProssed);
  console.log('done');
  return 'done';
};
