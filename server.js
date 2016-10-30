'use strict';

// Module imports
var express = require('express')
  , restify = require('restify')
  , http = require('http')
  , bodyParser = require('body-parser')
  , util = require('util')
  , _ = require('lodash')
;

//const DBHOST   = "https://129.152.129.94";
const DBHOST   = "https://ANKIDB";
const VERB = ['GET','POST'];
const restURI  = '/apex/pdb1';

// Instantiate classes & servers
var app    = express()
  , router = express.Router()
  , server = http.createServer(app)
  , dbClient = restify.createStringClient({
    url: DBHOST,
    rejectUnauthorized: false
  })
;

// ************************************************************************
// Main code STARTS HERE !!
// ************************************************************************

// Main handlers registration - BEGIN
// Main error handler
process.on('uncaughtException', function (err) {
  console.log("Uncaught Exception: " + err);
  console.log("Uncaught Exception: " + err.stack);
});
// Detect CTRL-C
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  console.log("Exiting gracefully");
  process.exit(2);
});
// Main handlers registration - END

// REST engine initial setup
const PORT = 9997;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REST stuff - BEGIN
router.use(function(_req, _res, next) {
  console.log(_req.method);
  console.log(_.includes(VERB, _req.method));
  if ( _req.method != VERB) {
    _res.status(405).end();
    return;
  }
  dbClient.get(restURI+_req.url, (err, req, res, data) => {
    if (err) {
      console.log("Error from DB call: " + err.statusCode);
      _res.status(err.statusCode).send(err.body);
      return;
    }
    _res.type('json');
    _res.send(data);
  });
});

app.use(restURI, router);
// REST stuff - END

server.listen(PORT, () => {
  _.each(router.stack, (r) => {
    console.log("Listening for any '%s' request at http://localhost:%s%s/*", VERB, PORT, restURI);
  });
});
