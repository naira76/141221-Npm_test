//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const db = require('../helpers/db');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('BMI', () => {
  beforeEach((done) => {
    // Before each test we empty the database
    db.deleteAllBMI()
      .then(() => {
        done();
      })
      .catch(() => {
        done();
      });
  });

  /*
   * Test the /POST route
   */
  describe('/POST bmi', () => {
    it('it should not POST bmi values without height, weight', (done) => {
      const data = [
        {
          Gender: 'Male',
        },
      ];
      chai
        .request(server)
        .post('/bmi')
        .send(data)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          res.body.should.have.property('message').eql('Service Failed');
          done();
        });
    });
  });
});

/*
 * Test the /GET route
 */
describe('/GET bmi', () => {
  it('it should GET all the bmi values', (done) => {
    chai
      .request(server)
      .get('/bmi')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.result.should.be.a('array');
        res.body.result.length.should.eql(0);
        done();
      });
  });
});

/*
 * Test the /POST route
 */
describe('/POST bmi', () => {
  it('it should POST bmi values with height, weight', (done) => {
    const data = [
      {
        Gender: 'Male',
        HeightCm: 167,
        WeightKg: 82,
      },
    ];
    chai
      .request(server)
      .post('/bmi')
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('result');
        res.body.result.should.eql(1);
        done();
      });
  });
});
