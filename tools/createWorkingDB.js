const Database = require('better-sqlite3');
const moment = require('moment');
const r = require('ramda');
const asTransaction = r.curry(require('../utils/db').asTransaction);
const transformFromZToDB = require('../utils/db').transformFromZToDB;

const cocoaTimeToTimestamp = (val) => moment('2001-01-01T00:00:00+00:00').add(val, 'seconds').unix();

const oldDB = new Database('./data/transitional/eventlog.sqlite', {
  readonly: true,
  fileMustExist: true
});

const row = oldDB.prepare('SELECT * FROM ZSLEEPEVENT').all();
const sorted = r.reduce(
  (acc, row) => {
    const newRow = { ...row, ZTIME: cocoaTimeToTimestamp(row.ZTIME) };
    acc.push(newRow);
    return acc;
  },
  [],
  row
);

const db = new Database('./data/sleepdata.db');
db.exec('DROP TABLE "SLEEPEVENT"');
db.exec('CREATE TABLE "SLEEPEVENT" (`session` INTEGER, `intensity` NUMERIC, `time` NUMERIC)');

const asTransactionWithDb = asTransaction(db);
const insertSleepEvent = db.prepare('INSERT INTO SLEEPEVENT (session, intensity, time) VALUES (@session, @intensity, @time)');
asTransactionWithDb(() => {
  r.map(val => {
    insertSleepEvent.run(transformFromZToDB(val));
  }, sorted);
})();
