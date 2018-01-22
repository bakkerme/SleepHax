const Database = require('better-sqlite3');
const r = require('rambda');
const fs = require('fs');
const asTransaction = r.curry(require('../utils/db').asTransaction);
const transformFromZToDB = require('../utils/db').transformFromZToDB;

const db = new Database('./data/sleepdata.db', {
  fileMustExist: true
});

const asTransactionWithDb = asTransaction(db);
const insertSleepEvent = db.prepare('INSERT INTO SLEEPEVENT (SESSION, INTENSITY, TIME) VALUES (@session, @intensity, @time)');

fs.readFile('./data/transitional/eventlog.json', 'utf8', function(err, data) {
  if(err) {
    return console.log(err);
  }

  const eventLog = JSON.parse(data);
  asTransactionWithDb(() => {
    r.map(val => {
      insertSleepEvent.run(transformFromZToDB(val));
    }, eventLog);
  })();
});
