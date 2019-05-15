require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');

const db = require('./models');
// firebase user auth
const firebase = require('firebase/app');
require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.firebase_apiKey,
  authDomain: 'group4proj2.firebaseapp.com',
  databaseURL: 'https://group4proj2.firebaseio.com',
  projectId: 'group4proj2',
  storageBucket: 'group4proj2.appspot.com',
  messagingSenderId: '839976170219',
  appId: process.env.firebase_appID
};
firebase.initializeApp(firebaseConfig);


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));
// app.use(express.bodyParser());

// Handlebars
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main',
  }),
);
app.set('view engine', 'handlebars');

// Routes
require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

const syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => {
    console.log(
      '==> Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT,
    );
  });
});

module.exports = app;
