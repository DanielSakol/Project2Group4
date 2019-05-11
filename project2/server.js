require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');

const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

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
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT,
    );
  });
});

const firebase = require('firebase/app');

require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyAYVGGhcwOrO97G3CpRsgEWvr5QqUsKpvA',
  authDomain: 'group4proj2.firebaseapp.com',
  databaseURL: 'https://group4proj2.firebaseio.com',
  projectId: 'group4proj2',
  storageBucket: 'group4proj2.appspot.com',
  messagingSenderId: '839976170219',
  appId: '1:839976170219:web:ccc53f18cdabca1c',
};

firebase.initializeApp(firebaseConfig);

firebase.auth().signInWithEmailAndPassword('daniel.sakol@yahoo.com', '123456')
  .then((user) => {
    if (user) {
      console.log(user);
    }
  })
  .catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;

    console.log(errorCode, errorMessage);
  });

module.exports = app;
