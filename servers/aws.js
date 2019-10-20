const aws = require("aws-sdk");
const { pool } = require("./initPool");
const mime = require("mime-types");
//const path = require("path");

aws.config = new aws.Config({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = {
  getRequest: async function (req, res) {
    console.log("this ran");
    try {
      const path = req.originalUrl.replace("/aws/", "");
      const file = await module.exports.getObject(path);
      res.writeHead(200, { "Content-Type": mime.contentType(path.match(/(?<=\.)[^.\/]+$/)[0]) });
      res.write(file.Body);
      res.end();
    }
    catch (err) {
      console.error(err);
      res.status(500).end();
    }
  },
  getObject: async function (file) {
    return await new aws.S3().getObject({
      Bucket: "liambloom",
      Key: file
    }).promise();
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
  pool,
  mime
};