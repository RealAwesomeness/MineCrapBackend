//Import the necessary libraries/declare the necessary objects
var express = require("express");
var myParser = require("body-parser");
var exchangeRates = require('./getExchangeRates');
var app = express();
        app.use(myParser.json());
	app.use(myParser.urlencoded({extended : true}));
	app.post("/best", function(request, response) {
		console.log(request.body); //This prints the JSON document received (if it is a JSON document)
		exchangeRates.getBest(request.body["hashrate"], request.body["power"], function(best) {
			response.send(best);
		});
});

//Start the server and make it listen for connections on port 8080
app.listen(8080);
