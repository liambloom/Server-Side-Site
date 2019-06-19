//jshint esversion:9
const fs = require("fs");
const ejs = require("ejs");
//const { convert } = require("convert-svg-to-png"); // resinstall with npm to run this program

make = () => {
  if (!fs.existsSync("./img/favicon/colors/red.png")) {
    fs.readFile("./json/themes.json", (error, data) => {
      if (error) console.error(error);
      else {
        const theme = JSON.parse(data);
        for (let color in theme) {
          ejs.renderFile("./img/favicon/main/favicon_vector.ejs", {
            light: theme[color].gradientLight,
            headTxt: theme[color].headTextColor
          }, (err, svg) => {
            if (err) console.error(err);
            else {
              convert(svg, {height: 171, width: 171}) // Try any larger than this and it will throw errors and only do part of the image. This size only throws errors
                .then(png => {
                  fs.writeFile(`./img/favicon/colors/${color}.png`, png, e => { if (e) console.error(e); });
                });
            }
          });
        }
      }
    });
  }
};

module.exports = make;