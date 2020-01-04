const serve = require("./servePage");

module.exports = {
  serve (req, res) {
    res.render("./forbidden/index", { game: "island", user: req.user || false, here: req.originalUrl }, (error, html) => {

    });
  }
};