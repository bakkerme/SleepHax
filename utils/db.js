function asTransaction(db, func) {
  const begin = db.prepare('BEGIN');
  const commit = db.prepare('COMMIT');
  const rollback = db.prepare('ROLLBACK');

  return function (...args) {
    begin.run();
    try {
      func(...args);
      commit.run();
    } finally {
      if (db.inTransaction) rollback.run();
    }
  };
}

function transformFromZToDB(val) {
  return {
    session: val.ZSLEEPSESSION,
    intensity: val.ZINTENSITY,
    time: val.ZTIME
  };
}

module.exports = {
  asTransaction: asTransaction,
  transformFromZToDB: transformFromZToDB
};
