const R = require('ramda');
const moment = require('moment');

const sampleData = (data, prop, period = 5) => {
  const grouped = R.reduce(
    (acc, val) => {
      const time = moment.unix(R.prop(prop, val));
      const remainder = time.minutes() % period;
      console.log(remainder, val.time);
      const roundedTimestamp = time.add('minutes', remainder).unix();

      if(!acc[roundedTimestamp]) {
        acc[roundedTimestamp] = [];
      }

      acc[roundedTimestamp].push(val);

      return acc;
    },
    {},
    data
  );

  // note: ramda doesn't support reducing objects
  // mapObjIndexed might work
  return R.reduce(
    (acc, val, key) => {
      const intensities = R.map(R.prop('intensity'), val);
      const averageI = R.mean(intensities);

      acc[key] = {
        ...val,
        intensity: averageI
      };
    },
    [],
    grouped
  );
};

module.exports =  sampleData;
