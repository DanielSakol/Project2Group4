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
    ndbno: ndbno, // a list of up to 25 nbd numbers
    api_key: process.env.usda_key
  };
  // console.log(params);
  // QueryUrl = 'https://api.nal.usda.gov/ndb/search/?format=json&ndbno=45346780&api_key=0RYf48D8ckcFA864kSW8vl49MtNxv2o99FhLHP01';
  const ndbnoStr = (Array.isArray(ndbno)) ? ndbno.join("&ndbno=") : ndbno;
  queryUrl = baseUrl
    // + Object.keys(params).map(k => k + '=' + params[k]).join('&')
    + 'format=' + 'json'
    + '&type=' + 's'
    + '&api_key=' + params.api_key
    + '&ndbno=' + ndbnoStr;
  console.log(queryUrl);
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

          const sqlEntry = {
            uid: currentUser.uid,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
            fullName: req.body.fullName
          };
          res.json(sqlEntry);

          db.usrTable.create(sqlEntry)
            .then(function (dbRecord) {
              console.log('entry written to sql usrTable');
            })
            .catch(error => {
              console.log(error);
              // res.json(error);
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

  app.post("/api/query/:uid", function (req, res) {
    // calling res.send() here is problematic for the other res.send() call later
    // res.send("custom api called");
    // console.log("custom api called");
    // const upc = '070038630678';//'096619756803'
    const upc = req.body.queryStr;
    console.log(upc);
    const uid = req.params.uid;
    console.log(uid);

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
          const ndbno = ndbLst[0];
          const ndbQueryUrl = genNdbnoQueryUrl(ndbno);
          console.log('Querying USDA food report using ndbno:\n', ndbQueryUrl);
          axios.get(ndbQueryUrl)
            .then(response => {
              // 
              // res.send(response.data);
              console.log(response.data);
              const ingStr = response.data.foods[0].food.ing.desc;
              const ingArr = ingStr.split(',');
              res.render('product', {
                productName: response.data.foods[0].food.desc.name,
                ingList: ingArr
              });
              // if successful, log query into mysql table
              if (uid) {
                console.log(uid);
                db.dbTable.create({
                  uid: uid,
                  dataUPC: upc,
                  dataNDBNO: ndbno
                }).then(dbItem => {
                  // console.log(dbItem);
                  console.log("query written to mysql table");
                });
              }
            })
            .catch(error => {
              console.log(error);
              res.send(error);
            });
        }
      })
      .catch(function (error) {
        console.log(error);
        res.send(error);
      });
  });

  app.post("/api/history", function (req, res) {
    console.log("/api/history called", req.body, req.body.uid);
    let retJSON = {};
    db.usrTable.findAll({ where: { uid: req.body.uid } })
      // get user profile
      .then(dbRecords => {
        // console.log(dbRecords);
        const userEntry = dbRecords[0].dataValues;
        // console.log(dbRecords[0].dataValues);
        retJSON['userName'] = userEntry.userName;
        retJSON['userEmail'] = userEntry.userEmail;
        retJSON['fullName'] = userEntry.fullName;
        console.log(retJSON);
        return retJSON
      })
      // get all products searched by user
      .then(retJSON => {
        console.log(req.body.uid);
        return db.dbTable.findAll({
          where: {
            uid: req.body.uid
          }
        })
          // turn ndbno into product info
          .then(function (dbRecords) {
            const ndbnoArr = dbRecords.map(v => v.dataValues.dataNDBNO);
            console.log(ndbnoArr);
            return axios.get(genNdbnoQueryUrl(ndbnoArr))
              .then(response => {
                // console.log(response);
                const nameArr = response.data.foods.map(v => v.food.desc.name);
                retJSON['history'] = nameArr;
                return retJSON
              })
            // retJSON['history'] = ndbnoArr;
            // console.log(retJSON);
            // return retJSON;
          })
          // return the result to frontend
          .then(retJSON => {
            // console.log(retJSON);
            res.json(retJSON);
          })
      })
    // db.dbTable.findAll({
    //   where: {
    //     uid: req.body.uid
    //   }
    // }).then(function (dbRecords) {
    //   const toPage = [];
    //   const ndbnoArr = dbRecords.map(v => v.dataValues.dataNDBNO);
    //   // ndbnoArr.forEach(v => {
    //   //   console.log(v);
    //   //   axios.get(genNdbnoQueryUrl(v))
    //   //     .then(response => {
    //   //       console.log(response.data.foods[0].food.desc.name);
    //   //       toPage.push(response.data.foods[0].food.desc.name);
    //   //     })
    //   // })

    //   // dbRecords[0].dataValues.dataNDBNO
    //   // console.log(genNdbnoQueryUrl(ndbnoArr));
    //   res.json(dbRecords);
    // });
  })

};
