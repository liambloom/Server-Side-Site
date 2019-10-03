const aws = require("aws-sdk");
const path = require("path");

aws.config = new aws.Config({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = {
  getObject: async function (file) {
    const data = await this.getObjects([file]);
    console.log(data);
    return data[file];
  },
  getObjects: async function (files) {
    const returnObject = {};
    await (async () => {
      for (let file of files) {
        new aws.S3().getObject({
          Bucket: "liambloom",
          Key: file/*.match(/^.*(?=\.[^.]*$)/),
        ContentType: file.match(/(?<=\.)[^.]*$/)*/
        }, (err, data) => {
          if (err) { console.error("There was an error\n" + error); throw err; }
          else { console.log(data); returnObject[file] = data; console.log(returnObject)};
        });
      }
    })();
    return returnObject;
    for (let file of files) {
      new aws.S3().getObject({
        Bucket: "liambloom",
        Key: file/*.match(/^.*(?=\.[^.]*$)/),
        ContentType: file.match(/(?<=\.)[^.]*$/)*/
      }, (err, data) => {
        if (err) { console.error("There was an error\n" + error); throw err; }
        else { console.log(data); returnObject[file] = data; }
      });
    }
    console.log(returnObject);
    return Promise.resolve(returnObject);
  }
};