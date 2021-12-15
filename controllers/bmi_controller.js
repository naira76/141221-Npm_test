const db = require('../helpers/db');

function storeBMI(req, res) {
  const values = req.body;
  if (!values || !Array.isArray(values) || !values.length) {
    return res
      .status(400)
      .send({ message: 'Invalid request payload', result: [] })
      .end();
  }

  db.bulkInsertBMI(values)
    .then((result) => {
      return res
        .status(200)
        .send({ message: 'Inserted successfully!', result: result })
        .end();
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Service Failed', result: [] })
        .end();
    });
}

function getAllBMI(req, res) {
  db.getAllBMI()
    .then((result) => {
      return res
        .status(200)
        .send({ message: 'Retrieved successfully!', result: result })
        .end();
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send({ message: 'Service Failed', result: [] })
        .end();
    });
}

module.exports = { storeBMI, getAllBMI };
