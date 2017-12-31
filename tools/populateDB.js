const Database = require('better-sqlite3');
const r = require('rambda');
const fs = require('fs');
const asTransaction = r.curry(require('../utils/db').asTransaction);
const transformFromZToDB = require('../utils/db').transformFromZToDB;

const db = new Database('sleepdata.db', {
  fileMustExist: true
});

const asTransactionWithDb = asTransaction(db);
const insertSleepEvent = db.prepare('INSERT INTO SLEEPEVENT (SESSION, INTENSITY, TIME) VALUES (@session, @intensity, @time)');

fs.readFile('./eventlog.json', function(err, data) {
  if(err) {
    return console.log(err);
  }

  asTransactionWithDb(() => {
    r.map(val => {
      insertSleepEvent.run(transformFromZToDB(val));
    }, data);
  });
});
