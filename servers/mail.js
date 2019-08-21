const sendGrid = require("@sendgrid/mail");
const ejs = require("ejs");
const { join } = require("path");
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = (path, subject, to, renderOptions) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(join(__dirname, path), renderOptions, (err, html) => {
      if (err) { reject(err); console.err("err" + err);}
      else {
        try {
          sendGrid.send({
            to,
            from: "liambloom@liambloom.herokuapp.com",
            subject,
            html
          });
          resolve();
        }
        catch (err) {
          console.error("err" + err);
          reject(err);
        }
      }
    });
  });
};