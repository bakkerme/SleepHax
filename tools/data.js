const R = require('ramda');
const moment = require('moment');

const sampleData = (data, prop, period = 5) => {
  const grouped = R.reduce(
    (acc, val) => {
      const time = moment.unix(R.prop(prop, val));
      const remainder = time.minutes() % period;
      const roundedTimestamp = time.subtract('minutes', remainder).unix();

      if(!acc[roundedTimestamp]) {
        acc[roundedTimestamp] = [];
      }

      const updatedVal = {
        ...val,
        time: roundedTimestamp
      };

      acc[roundedTimestamp].push(updatedVal);

      return acc;
    },
    {},
    data
  );

  const out = R.mapObjIndexed(
    (val) => {
      const intensities = R.map(R.prop('intensity'), val);
      const averageI = R.mean(intensities);

      return {
        ...val[0],
        intensity: averageI
      };
    },
    grouped
  );

  console.log(R.map((t) => moment.unix(t).format('h:mm'), R.keys(out)));
  return out;
};

module.exports =  sampleData;
