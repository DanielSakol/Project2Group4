var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.dbTable.findAll({})
      .then(function (dbExamples) {
        // res.render("index", {
        //   msg: "Welcome!",
        //   examples: dbExamples
        // });
        res.render("home");
      });
  });

  // Load signup page
  app.get("/signup", function (req, res) {
    db.dbTable.findAll({})
      .then(function (dbExamples) {
        // res.render("index", {
        //   msg: "Welcome!",
        //   examples: dbExamples
        // });
        res.render("signup");
      });
  });

  // Load product page
  app.get("/product", function (req, res) {
    db.Example.findAll({})
      .then(function (dbExamples) {
        // res.render("index", {
        //   msg: "Welcome!",
        //   examples: dbExamples
        // });
        res.render("product");
      });
  });
  

  // Load example page and pass in an example by id
  app.get("/example/:id", function (req, res) {
    db.dbTable.findOne({ where: { id: req.params.id } })
      .then(function (dbExample) {
        res.render("example", {
          example: dbExample
        });
      });
  });

    // Load product page
    app.get("/barcode", function (req, res) {
      db.Example.findAll({})
        .then(function (dbExamples) {
          // res.render("index", {
          //   msg: "Welcome!",
          //   examples: dbExamples
          // });
          res.render("barcode");
        });
    });


  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
