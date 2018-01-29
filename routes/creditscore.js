/*
 * GET list of all scores. 
 * Then we will enhance this method to connect to a OracleDB service broker instance,
 * run a simple query and return a response message.
 *
 */
var resultData = {};
exports.list = function(req, res) {
    console.log("Entering list all scores function V2");
    console.log(req.body);

    // Start of db code block
    console.log("Access the env variable in nodejs. Value of : process.env" + process.env);
    // var DB_INFO = process.env.DB_INFO;
    // console.log("Access the env variable in nodejs. Value of : process.env.DB_INFO is " + DB_INFO);

    // var DB_INFO_JSON = JSON.parse(DB_INFO);
    // console.log("Access the env variable in nodejs. Value of : DB_INFO_JSON is " + DB_INFO_JSON);
    // var host = DB_INFO_JSON.host;
    // console.log("Access the env variable in nodejs. Value of : DB host is " + host);
    // var adminuser = DB_INFO_JSON.adminuser;
    // console.log("Access the env variable in nodejs. Value of : DB adminuser is " + adminuser);
    // var adminpassword = DB_INFO_JSON.adminpassword;
    // console.log("Access the env variable in nodejs. Value of : DB adminpassword is " + adminpassword);

    var oracledb = require('oracledb');
    oracledb.getConnection({
            user: "SYS",
            password: "welcome1",
            connectString: "localhost:1521/XE"
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
            } else {
                console.log("Connected to DB");
                connection.execute("select * from scores;",
                    function(err, result) {
                        if (err) {
                            console.log("DB communication error : " + err);
                            resultData = {
                                "MESSAGE": "ERROR communicating with DB-" + err
                            };
                        } else {
                            console.log(result.rows);
                            resultData = result.rows;
                        }
                    });
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resultData));
        });
    // End of db code block

};


exports.create = function(req, res) {
    console.log("Entering create all scores function V2");
    console.log(req.body);

    // Start of db code block
    console.log("Access the env variable in nodejs. Value of : process.env" + process.env);
    // var DB_INFO = process.env.DB_INFO;
    // console.log("Access the env variable in nodejs. Value of : process.env.DB_INFO is " + DB_INFO);

    // var DB_INFO_JSON = JSON.parse(DB_INFO);
    // console.log("Access the env variable in nodejs. Value of : DB_INFO_JSON is " + DB_INFO_JSON);
    // var host = DB_INFO_JSON.host;
    // console.log("Access the env variable in nodejs. Value of : DB host is " + host);
    // var adminuser = DB_INFO_JSON.adminuser;
    // console.log("Access the env variable in nodejs. Value of : DB adminuser is " + adminuser);
    // var adminpassword = DB_INFO_JSON.adminpassword;
    // console.log("Access the env variable in nodejs. Value of : DB adminpassword is " + adminpassword);

    var oracledb = require('oracledb');
    oracledb.getConnection({
            user: "user",
            password: "adminpassword",
            connectString: "localhost/XE"
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
            } else {
                console.log("Connected to DB");
                connection.execute("CREATE TABLE scores (firstname VARCHAR2(30),lastname VARCHAR2(30),ssn VARCHAR2(30),dateofbirth VARCHAR2(30), score VARCHAR2(30);)",
                    function(err, result) {
                        if (err) {
                            console.log("DB create table error : " + err);
                            resultData = {
                                "MESSAGE": "ERROR creating a table in DB-" + err
                            };
                        } else {
                            console.log(result.rows);
                            resultData = {
                                "MESSAGE": "SUCCESS created a table in DB"
                            };
                        }
                    });
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resultData));
        });
    // End of db code block

};

var SCORE_MAX = 800;
var SCORE_MIN = 550;
var util = require('util');

/*
 * POST scoring.
 */

exports.score = function(req, res) {
	// Start of db code block
    console.log("Access the env variable in nodejs. Value of : process.env" + process.env);
    // var DB_INFO = process.env.DB_INFO;
    // console.log("Access the env variable in nodejs. Value of : process.env.DB_INFO is " + DB_INFO);

    // var DB_INFO_JSON = JSON.parse(DB_INFO);
    // console.log("Access the env variable in nodejs. Value of : DB_INFO_JSON is " + DB_INFO_JSON);
    // var host = DB_INFO_JSON.host;
    // console.log("Access the env variable in nodejs. Value of : DB host is " + host);
    // var adminuser = DB_INFO_JSON.adminuser;
    // console.log("Access the env variable in nodejs. Value of : DB adminuser is " + adminuser);
    // var adminpassword = DB_INFO_JSON.adminpassword;
    // console.log("Access the env variable in nodejs. Value of : DB adminpassword is " + adminpassword);
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

    var oracledb = require('oracledb');
    oracledb.getConnection({
            user: "user",
            password: "adminpassword",
            connectString: "localhost/XE"
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
            } else {
                console.log("Connected to DB");
                connection.execute("insert into scores values('" + firstname + "','" + lastname + "','" + ssn + "','" + dateofbirth + "','" + score + "')", function(err, result) {
                    if (err) {
                        console.log("DB insert error : " + err);
                        resultData = {
                            "MESSAGE": "ERROR inserting to DB-" + err
                        };
                    } else {
                        console.log(result.rows);
                        resultData = {
                            "firstname": firstname,
                            "lastname": lastname,
                            "ssn": ssn,
                            "dateofbirth": dateofbirth,
                            "score": score
                        };
                    }
                });
            }
            res.setHeader('Content-Type', 'application/json');
            console.log(resultData);
            res.send(JSON.stringify(resultData));
        });

};

/*
 * Hashcode for String.
 */

String.prototype.hashCode = function() {
    var hash = 0,
        i, chr;
    if (this.length === 0) {
        return hash;
    }
    for (i = 0; i < this.length; i++) {
        /*jslint bitwise: true */
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
};
