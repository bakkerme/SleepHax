const Database = require('better-sqlite3');
const moment = require('moment');
const r = require('rambda');
const fs = require('fs');

const cocoaTimeToTimestamp = (val) => moment('2001-01-01T00:00:00+00:00').add(val, 'seconds').unix();

const db = new Database('./data/transitional/eventlog.sqlite', {
  readonly: true,
  fileMustExist: true
});

const row = db.prepare('SELECT * FROM ZSLEEPEVENT').all();
const sorted = r.reduce(
  (acc, row) => {
    const newRow = { ...row, ZTIME: cocoaTimeToTimestamp(row.ZTIME) };
    acc.push(newRow);
    return acc;
  },
  [],
  row
);

fs.writeFile('./data/transitional/eventlog.json', JSON.stringify(sorted), function(err) {
  if(err) {
    return console.log(err);
  }

  console.log('The file was saved!');
});
