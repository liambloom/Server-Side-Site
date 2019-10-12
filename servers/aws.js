const aws = require("aws-sdk");
const { pool } = require("./initPool");
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
  getObjects: async function (files) {
    const promises = {};
    for (let file of files) {
      promises[file] = new aws.S3().getObject({
        Bucket: "liambloom",
        Key: file
      }).promise();
    }
    try {
      return await Promise.all(promises);
    }
    catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  },
  pool
};