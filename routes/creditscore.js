/*
 * GET list of all scores. 
 * Then we will enhance this method to connect to a OracleDB service broker instance,
 * run a simple query and return a response message.
 *
 */
console.log("Access the env variable in nodejs. Value of : process.env" + process.env);
var connectstring = process.env.DB_CONNECT_STRING;
console.log("Access the env variable in nodejs. Value of : DB connect string is " + connectstring);
var adminuser = process.env.DB_USER;
console.log("Access the env variable in nodejs. Value of : DB adminuser is " + adminuser);
var adminpassword = process.env.DB_PASSWORD;
console.log("Access the env variable in nodejs. Value of : DB adminpassword is " + adminpassword);
var tablespacename = process.env.DB_TABLESPACE;
console.log("Access the env variable in nodejs. Value of : DB tablespace is " + tablespacename);

exports.list = function(req, res) {
    console.log("Entering list all scores function V2");
    console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    // Start of db code block
    var oracledb = require('oracledb');
    oracledb.getConnection({
            user: adminuser,
            password: adminpassword,
            connectString: connectstring
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
                res.send(JSON.stringify(resultData));
            } else {
                console.log("Connected to DB");
                connection.execute("select * from scores",
                    function(err, result) {
                        if (err) {
                            console.log("DB communication error : " + err);
                            resultData = {
                                "MESSAGE": "ERROR communicating with DB-" + err
                            };
                            res.send(JSON.stringify(resultData));
                        } else {
                            console.log(result.rows);
                            var reo ='<html><head><title>Credit Score List</title></head><body><h1>Credit Score List</h1>{${table}}</body></html>';
                            var table =''; //to store html table
                            console.log("No. of rows: " + result.rows.length)
                            for(var i=0; i<result.rows.length; i++){
                                console.log("row: " + i)
                                table +='<tr><td>'+ (i+1) +'</td><td>'+ result.rows[i][0] +'</td><td>'+ result.rows[i][1] +'</td><td>' + result.rows[i][3] +'</td><td>' + result.rows[i][2] +'</td><td>' + result.rows[i][4] +'</td></tr>';
                            }
                            table ='<table border="1"><tr><th>#</th><th>FirstName</th><th>LastName</th><th>DateOfBirth</th><th>SSN</th><th>Score</th></tr>'+ table +'</table>';
                            reo = reo.replace('{${table}}', table);
                            res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
                            res.write(reo, 'utf-8');
                            res.end();
                        }
                    });
            }


        });
    // End of db code block
};


exports.create = function(req, res) {
    console.log("Entering create all scores function V2");
    console.log(req.body);
    res.setHeader('Content-Type', 'application/json');
    // Start of db code block
    var oracledb = require('oracledb');
    oracledb.getConnection({
            user: adminuser,
            password: adminpassword,
            connectString: connectstring
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
                res.send(JSON.stringify(resultData));
            } else {
                console.log("Connected to DB");
                var createstmt;
                if (tablespacename.length == 0) {
                    createstmt = "CREATE TABLE scores(firstname VARCHAR2(30),lastname VARCHAR2(30),ssn VARCHAR2(30),dateofbirth VARCHAR2(30),score VARCHAR2(30))";
                } else {
                    createstmt = "CREATE TABLE scores(firstname VARCHAR2(30),lastname VARCHAR2(30),ssn VARCHAR2(30),dateofbirth VARCHAR2(30),score VARCHAR2(30)) tablespace \"" + tablespacename + "\"";
                }
                console.log("db create statement " + createstmt);
                connection.execute(createstmt,
                    function(err, result) {
                        if (err) {
                            console.log("DB create table error : " + err);
                            resultData = {
                                "MESSAGE": "ERROR creating a table in DB-" + err
                            };
                            res.send(JSON.stringify(resultData));
                        } else {
                            console.log(result.rows);
                            resultData = {
                                "MESSAGE": "SUCCESS created a table in DB"
                            };
                            res.send(JSON.stringify(resultData));
                        }
                    });
	        connection.commit()
            }


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
    res.setHeader('Content-Type', 'application/json');
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
            user: adminuser,
            password: adminpassword,
            connectString: connectstring
        },
        function(err, connection) {
            if (err) {
                console.log("DB connection error : " + err);
                resultData = {
                    "MESSAGE": "ERROR connecting to DB-" + err
                };
                res.send(JSON.stringify(resultData));
            } else {
                console.log("Connected to DB");
                console.log("insert into scores values('" + firstname + "','" + lastname + "','" + ssn + "','" + dateofbirth + "','" + score + "')")
                connection.execute("insert into scores values('" + firstname + "','" + lastname + "','" + ssn + "','" + dateofbirth + "','" + score + "')", function(err, result) {
                    if (err) {
                        console.log("DB insert error : " + err);
                        resultData = {
                            "MESSAGE": "ERROR inserting to DB-" + err
                        };
                        res.send(JSON.stringify(resultData));
                    } else {
                        console.log(result.rows);
                        resultData = {
                            "firstname": firstname,
                            "lastname": lastname,
                            "ssn": ssn,
                            "dateofbirth": dateofbirth,
                            "score": score
                        };
                        res.send(JSON.stringify(resultData));
                    }
                });
                connection.commit()
            }
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
