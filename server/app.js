const express = require('express');
const app = express();
var Request = require("request");
var mysql = require('mysql');

/*
for /submitScore
let bodyParser = require('body-parser');
app.use(bodyParser.json());
*/

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//connecting express to model hangman in mysql
var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'hangman',
  password : 'password',
  database : 'hangman'
});

app.get('/getScores', (req, res) => {
  //get connection from pool object
  connection.getConnection(function (err, connection) {
    if (err) throw err;
    //run select query
    connection.query("select username,score from user_Scores order by score desc limit 5", function (err, rows) {
      connection.release(); //release connection
      var apiResult = {};
      var resultJson = JSON.stringify(rows);
      resultJson = JSON.parse(resultJson);
      apiResult.scores = resultJson
      console.log(apiResult);
      res.status(200).json(apiResult);
    });
  });
});

// app.post('/submitScore', (req, res) => {
//   console.log("req = ", req.body.name);
//   const values = {username: req.body.name, score: req.body.score}
//   connection.getConnection(function (err, connection) {
//     if (err) throw err;
//       connection.query("Insert into  user_scores  (username, score) VALUES ('"+req.body.name+"','"+req.body.score+"')", function (err, rows) {
//           connection.release();
//           res.status(200).json({sucess: true});
//       });
//   });
//
// })

app.get('/getWords', (req, res) => {

Request.get("http://app.linkedin-reach.io/words?difficulty=" + req.query.difficulty, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.status(200).json({ words: body });
});
})

app.listen(4000, () => console.log('Example app listening on port 4000!'))
