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
const restURI  = '/apex/pdb1/anki/analytics';
const LAP      = "/laptime/:demozone"

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
const PORT = 9998;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// REST stuff - BEGIN
router.get(LAP, function(_req, _res) {
  var demozone = _req.params.demozone;
  dbClient.get(restURI + LAP.replace(':demozone', demozone), (err, req, res, data) => {
    _res.send(data);
  });
});

app.use(restURI, router);
// REST stuff - END

server.listen(PORT, () => {
  _.each(router.stack, (r) => {
    // We take just the first element in router.stack.route.methods[] as we assume one HTTP VERB at most per URI
    console.log("'" + _.keys(r.route.methods)[0].toUpperCase() + "' method available at https://localhost:" + PORT + restURI + r.route.path);
  });
});
