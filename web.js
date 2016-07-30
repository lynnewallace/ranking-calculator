var express = require('express');
require('newrelic')

var app = express.createServer(express.logger());
app.use('/', express.static(__dirname)); //use static files in ROOT/public folder

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});