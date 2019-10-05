const aws = require("aws-sdk");
//const path = require("path");

aws.config = new aws.Config({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = {
  getObject: async function (file, cb) {
    this.getObjects([file], (data, err) => {
      if (data) cb(data[file]);
      else cb(data, err);
    });
  },
  getObjects: async function (files, cb) {
    const returnObject = {};
    let cbHasRun = false;
    for (let i = 0; i < files.length; i++) {
      if (cbHasRun) break;
      new aws.S3().getObject({
        Bucket: "liambloom",
        Key: files[i]
      }, (err, data) => {
        if (err) {
          cb(undefined, err);
          cbHasRun = true;
        }
        else returnObject[files[i]] = data;
        if (i + 1 === files.length) cb(returnObject);
      });
      
    }
  }
};