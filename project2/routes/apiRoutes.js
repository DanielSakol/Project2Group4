var db = require("../models");
const axios = require("axios");

const firebase = require('firebase/app');
require('firebase/auth');

/*
NDB API search:
https://ndb.nal.usda.gov/ndb/doc/apilist/API-SEARCH.md

NDB API food report V1
https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORT.md

NDB API food report V2
https://ndb.nal.usda.gov/ndb/doc/apilist/API-FOOD-REPORTV2.md
*/
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
  const baseUrl = 'https://api.nal.usda.gov/ndb/V2/reports/?';
  const params = {
    format: 'json',
    type: 's', // [b]asic, [f]ull, [s]tats
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
    db.dbTable.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.dbTable.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.dbTable.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  //--------
  app.post("/api/signin", function (req, res) {
    console.log("/api/signin called");
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (user) {
          let currentUser = firebase.auth().currentUser;
          console.log(currentUser.uid);
          res.json({ uid: currentUser.uid });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        res.json(error);
      });
  });

  app.post("/api/signup", function (req, res) {
    console.log("/api/signup called");
    console.log(req.body);

    firebase.auth().createUserWithEmailAndPassword(req.body.userEmail, req.body.userPswd)
      .then((user) => {
        if (user) {
          let currentUser = firebase.auth().currentUser;
          console.log(currentUser.uid);
          res.json({ uid: currentUser.uid });

          db.dbTable.create(req.body).then(function (dbExample) {
            res.json(dbExample);
          });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        res.json(error);
      });

  });

  app.post("/api/query", function (req, res) {
    // calling res.send() here is problematic for the other res.send() call later
    // res.send("custom api called");
    // console.log("custom api called");
    // const upc = '070038630678';//'096619756803'
    const upc = req.body.queryStr;
    const uid = req.body.uid;
    
    if (uid) {
      console.log(uid);
      db.dbTable.create({
        uid: uid,
        dataUPC: upc
        // dataNDBNO:
      }).then(dbItem => { console.log(dbItem); });
    }

    const upcQueryUrl = genUpcQueryUrl(upc);
    console.log('Searching ndbno in USDA using UPC:\n', upcQueryUrl);
    axios
      .get(upcQueryUrl)
      .then(function (response) {
        // console.log(response);
        // res.send(response.data);

        // TODO: handle the case of no results
        const itemLst = response.data.list.item;
        const ndbLst = itemLst.map(v => v.ndbno);
        // console.log('item list matching upc code: ', itemLst);
        // console.log('extracted ndbno: ', ndbLst);

        if (ndbLst) {
          const ndbQueryUrl = genNdbnoQueryUrl(ndbLst[0]);
          console.log('Querying USDA food report using ndbno:\n', ndbQueryUrl);
          axios.get(ndbQueryUrl)
            .then(response => {
              // 
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

  // Create a new record in mysql table
  app.post("/api/log", function (req, res) {
    console.log(req);
    let record = {
      uid: req.body.uid,
      dataUPC: req.body.dataUPC,
      dataNDBNO: req.body.dataNDBNO
    }
    db.dbTable.create(record)
      .then(function (dbRecord) {
        res.json(dbRecord);
      });
  });
};
