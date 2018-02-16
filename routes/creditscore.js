const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
//const url = 'mongodb://root:MSCCRVKOIA@mongodb-sb-inst-1-mongodb.default.svc.cluster.local:27017/admin';
//const url = 'mongodb://mongodb-inst-1-mongodb.default.svc.cluster.local:27017/credit-score';
//const url = 'mongodb://oracle:oracle@ds245687.mlab.com:45687/credit-score';

// Database Name
const dbName = 'credit-score';


var SCORE_MAX = 800;
var SCORE_MIN = 550;
var util = require('util');

    // Start of db code block
    console.log("Access the env variable in nodejs. Value of : process.env" + process.env);
    var DB_INFO = process.env.DB_INFO;
    console.log("Access the env variable in nodejs. Value of : process.env.DB_INFO is " + DB_INFO);

    var DB_INFO_JSON = JSON.parse(DB_INFO);
    console.log("Access the env variable in nodejs. Value of : DB_INFO_JSON is " + DB_INFO_JSON);
    var host = DB_INFO_JSON.host;
    console.log("Access the env variable in nodejs. Value of : DB host is " + host);
    var adminuser = DB_INFO_JSON.adminuser;
    console.log("Access the env variable in nodejs. Value of : DB adminuser is " + adminuser);
    var adminpassword = DB_INFO_JSON.adminpassword;
    console.log("Access the env variable in nodejs. Value of : DB adminpassword is " + adminpassword);
    var port = DB_INFO_JSON.port;
    console.log("Access the env variable in nodejs. Value of : DB port is " + port);
var url = "mongodb://" + host + ":" + port + "/"

/*
 * POST scoring.
 */

exports.score = function(req, res){
  if (req.is('application/json')) {
	  console.log("JSON");
	  console.log(req.body);
	  var person = JSON.parse(JSON.stringify(req.body));
	  var firstname = person.firstname,
	      lastname = person.lastname,
	      dateofbirth = person.dateofbirth,
	      ssn = person.ssn;
  } else {

	  console.log('Request body: ' + util.inspect(req.body));
	  var firstname = req.body.firstname,
	      lastname = req.body.lastname,
	      dateofbirth = req.body.dateofbirth,
	      ssn = req.body.ssn;
  }  
  var score = firstname.hashCode() + lastname.hashCode() + dateofbirth.hashCode() + ssn.hashCode();
  
  score = score % SCORE_MAX;
  
  while (score < SCORE_MIN) {
	score = score + 100;
  }  
  
  var resultData = { "firstname": firstname, 
		  "lastname": lastname,
          "ssn": ssn,
          //"ssn": "999-99-9999",
		  "dateofbirth": dateofbirth, 
		  "score": score
		};

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, db) {
        if (err) {
            console.log("Unable to connect to mongo: " + err);
        } else {
            console.log("We are connected to mongo");
            console.log("Connected successfully to server .. Proceeding to insert the credit score");

        const db = client.db(dbName);

            // Use this method to save a credit score
            insertCreditScore(resultData, db, function () {
                console.log("Inserted the credit score");
//            client.close();
                db.close();
            });
        }

    });


    res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(resultData));
};

/*
 * Hashcode for String.
 */

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) {
	  return hash;
  }
  for (i = 0; i < this.length; i++) {
	/*jslint bitwise: true */
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/*
 * GET list of all scores. In this version we don't persist any scores so there is nothing to return
 */

exports.list = function(req, res){
    console.log("Entering list all scores function V2");
    console.log(req.body);

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        var resultData
        if (err) {
            console.log("DB communication error : " + err);
            resultData = {
                "MESSAGE" : "ERROR communicating with mongodb instance"
            };
        } else {
        console.log("Connected successfully to server");

            resultData = {
                "MESSAGE" : "SUCCESS communicating with mongodb instance"
            };
       }
/*        const db = client.db(dbName);

        // Use this method to get all credit scores
        resultData = getAllCreditScores(db, function() {
            client.close();
        });
*/
       res.setHeader('Content-Type', 'application/json');
       res.send(JSON.stringify(resultData));
    });

};


/*
 * Insert credit score
 */

const insertCreditScore = function(creditScore, db, callback) {
    console.log("Entering insertCreditScore function");
    db.collection('credit-scores').insertMany([creditScore], function(err, result) {
        if (err) {
            console.log("Error inserting credit score in mongo: " + err);
        } else {
            console.log("Inserted credit score in mongo");
//            assert.equal(1, result.result.n);
//            assert.equal(1, result.ops.length);
            console.log("Inserted 1 creditscore into the collection: " + result);
            callback(result);
        }
    });
}

/*
 * Get all credit scores
 */

const getAllCreditScores = function(db, callback) {
    // Get the credit-scores collection
    const collection = db.collection('credit-scores');
    // Find all documents
    collection.find({}).toArray(function(err, docs) {
        if (err) {
            console.log("Error finding credit scores in mongo: " + err);
        } else {
            console.log("Found the following credit scores");
            console.log(docs);
            callback(docs);
        }
    });
}
