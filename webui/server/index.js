const Database = require('better-sqlite3');
const express = require('express');
const bodyParser = require('body-parser');

const db = new Database('./data/sleepdata.db', {
  fileMustExist: true
});

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/session/:sessionId')
  .get((req, res) => {
    const sessionId = Number.parseInt(req.params.sessionId);

    const sleepSessionQuery = db.prepare('SELECT * FROM SLEEPEVENT WHERE session=@sessionId');
    const rows = sleepSessionQuery.all({sessionId: sessionId});

    res.set('Access-Control-Allow-Origin', '*');
    res.json({count:  rows.length, events: rows});   
  });

app.use('/', router);

app.listen(port);
console.log('Magic happens on port ' + port);


