/*
 * GET list of all scores. Will return a simple Welcome message first!
 * Then we will enhance this method to connect to a MySQL service broker instance,
 * run a simple query and return a response message.
 *
 * Note: In this version we don't persist any scores so there are no scores to return.
 */

exports.list = function(req, res){
    console.log("Entering list all scores function V2");
    console.log(req.body);

    var resultData = {

// _CHANGE_ : Please comment the line with the DUMMY message and uncomment the one with the Welcome message
        "MESSAGE": "DUMMY message V2"
        //"MESSAGE": "Welcome to aura-js-creditscore version V2"

    };

// _CHANGE_Part_3_Service_Broker_Integration_ :
// 1) Comment the two methods res.setHeader() and res.send()
// 2) Uncomment the entire db code block below to use DB

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(resultData));

/*
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


    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : host,
        user     : adminuser,
        password : adminpassword
    });

    connection.query('SELECT 1', function (error, results, fields) {
        if (error) {
            console.log("DB communication error : " + error);
            resultData = {
                "MESSAGE" : "ERROR communicating with DB"
            };
        } else {
            console.log("Connected to DB");
            console.log("Query execution results: " + results);
            console.log("Query execution fields: " + fields);
            resultData = {
                "MESSAGE" : "SUCCESS communicating with DB"
            };
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(resultData));

    });
    // End of db code block
*/

};



var SCORE_MAX = 800;
var SCORE_MIN = 550;
var util = require('util');

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

