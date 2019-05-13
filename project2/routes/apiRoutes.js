var db = require("../models");
const axios = require("axios");

const genUpcQueryUrl = function (upcCode) {
  const baseUrl = 'https://api.nal.usda.gov/ndb/search/?';
  const params = {
    format: 'json',
    q: upcCode,
    api_key: process.env.usda_key
  };
  // QueryUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&q=070038630678&api_key=0RYf48D8ckcFA864kSW8vl49MtNxv2o99FhLHP01';
  queryUrl = baseUrl + Object.keys(params).map(k => k + '=' + params[k]).join('&');
  return queryUrl;
}

const genNdbnoQueryUrl = function (ndbno) {
  // const baseUrl = 'https://api.nal.usda.gov/ndb/search/?';
  const baseUrl = 'https://api.nal.usda.gov/ndb/reports/?';
  const params = {
    format: 'json',
    type:'s', // [b]asic, [f]ull, [s]tats
    ndbno: [ndbno], // a list of up to 25 nbd numbers
    api_key: process.env.usda_key
  };
  // QueryUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&ndbno=45346780&api_key=0RYf48D8ckcFA864kSW8vl49MtNxv2o99FhLHP01';
  queryUrl = baseUrl + Object.keys(params).map(k => k + '=' + params[k]).join('&');
  return queryUrl;
}

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  app.get("/api/dev", function (req, res) {
    // calling res.send() here is problematic for the other res.send() call later
    // res.send("custom api called");
    // console.log("custom api called");
    const upc = '070038630678';//'096619756803'
    const upcQueryUrl = genUpcQueryUrl(upc);
    console.log('UPC query url:\n', upcQueryUrl);
    axios
      .get(upcQueryUrl)
      .then(function (response) {
        // console.log(response);
        // res.send(response.data);

        const itemLst = response.data.list.item;
        const ndbLst = itemLst.map(v => v.ndbno);
        console.log('item list matching upc code: ', itemLst);
        console.log('extracted ndbno: ', ndbLst);

        if (ndbLst) {
          const ndbQueryUrl = genNdbnoQueryUrl(ndbLst[0]);
          console.log('ndbno query url:\n', ndbQueryUrl);
          axios.get(ndbQueryUrl)
            .then(response => {
              // console.log(response.data);

              res.send(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  });
};
