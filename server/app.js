const express = require('express')
const app = express()
var Request = require("request");
var mysql = require('mysql')

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

var connection = mysql.createPool({
  host     : 'localhost',
  user     : 'hangman',
  password : '1l0vesleep',
  database : 'hangman'
});

//connection.connect()

app.get('/getScores', (req, res) => {
  connection.getConnection(function (err, connection) {
      connection.query("select username,score from user_Scores order by score desc", function (err, rows) {
          connection.release();
          if (err) throw err;

           var apiResult = {};
          var resultJson = JSON.stringify(rows);
            resultJson = JSON.parse(resultJson);
            apiResult.scores = resultJson
              console.log(apiResult);
          res.status(200).json(apiResult);
      });
  });
})

app.get('/getWords', (req, res) => {
//res.send('Hello World!')
Request.get("http://app.linkedin-reach.io/words?difficulty=" + req.query.difficulty, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.status(200).json({ words: body });
});
})

app.listen(4000, () => console.log('Example app listening on port 4000!'))
