const Promise = require('bluebird');
const dbConfig = require('../config/db_config');

const initOptions = {
  promiseLib: Promise,
};
const pgp = require('pg-promise')(initOptions);
const db = pgp(dbConfig);

function getData(values, numberOfPages, limit) {
  return function (index) {
    let data = null;
    try {
      if (numberOfPages > index) {
        data = values.slice(index, index + limit);
        data = data.map((d) => calculateBMI(d));
      }
      return Promise.resolve(data);
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

function calculateBMI(data) {
  const weight = parseFloat(data['WeightKg']);
  const height = parseFloat(data['HeightCm']);

  if (Number.isNaN(weight) || Number.isNaN(height)) {
    throw 'Invalid data';
  }

  const bmi = Number(Number(weight / (height * 0.1) ** 2).toFixed(2));
  let category = '',
    risk = '';

  switch (true) {
    case bmi <= 18.4:
      category = 'Underweight';
      risk = 'Malnutrition risk';
      break;
    case bmi >= 18.5 && bmi <= 24.9:
      category = 'Low risk,';
      risk = 'Malnutrition risk';
      break;
    case bmi >= 25 && bmi <= 29.9:
      category = 'Enhanced risk';
      risk = 'Malnutrition risk';
      break;
    case bmi >= 30 && bmi <= 34.9:
      category = 'Medium risk';
      risk = 'Malnutrition risk';
      break;
    case bmi >= 35 && bmi <= 39.9:
      category = 'High risk';
      risk = 'Malnutrition risk';
      break;
    case bmi >= 40:
      category = 'Very severely obese';
      risk = 'Very high risk';
      break;
  }

  return { bmi, category, risk };
}

function bulkInsertBMI(values = []) {
  return new Promise((resolve, reject) => {
    // our set of columns, to be created only once (statically), and then reused,
    // to let it cache up its formatting templates for high performance:
    const cs = new pgp.helpers.ColumnSet(['bmi', 'category', 'risk'], {
      table: 'bmi',
    });

     db.tx('massive-insert', (t) => {
      let total = 0;
      const processData = (data) => {
        const len = data.length;
        if (len) {
          total += len;
          const insert = pgp.helpers.insert(data, cs);
          return t.none(insert);
        }
      };

      const limit = 10000;
      const numberOfPages = Math.ceil(values.length / limit);
      const getNextData = getData(values, numberOfPages, limit);

      return t
        .sequence(index => getNextData(index).then(processData), { limit: numberOfPages }).then(() => total)
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

function deleteAllBMI() {
  return db.query('delete from bmi');
}

function getAllBMI() {
  return db.query('select * from bmi');
}

module.exports = {
  bulkInsertBMI,
  deleteAllBMI,
  getAllBMI,
};
