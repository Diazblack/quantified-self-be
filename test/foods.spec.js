const pry = require('pryjs');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../lib/index');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('API routes', () => {

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('POST api/v1/foods/', () => {
    it("should create a new food", done => {
      chai.request(server)
        .post('/api/v1/foods/')
        .send({
          name: "Potatoes",
          calories: 450
        })
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.should.have.property('name');
          response.body.should.have.property('calories');
        });
      done();
    });

    it('should not create a record with missing data', done => {
      chai.request(server)
        .post('/api/v1/foods/')
        .send({
          name: 'Potatoes'
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.error.should.equal(
            `Expected format: { name: <String>, calories: <String> }. You're missing a "calories" property.`
          );
        });
        done();
    });
  });

  describe('GET /api/v1/foods/', () => {
    it("should return all the food", done => {
      chai.request(server)
        .get('/api/v1/foods/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Tea');
          response.body[0].should.have.property('calories');
          response.body[0].calories.should.equal(100);
          response.body[0].should.have.property('id');
          done();
        });
    });
  });

  describe('GET /api/v1/foods/id', () => {
    it("should return an specific food by id", done => {
      chai.request(server)
        .get(`/api/v1/foods/3`)
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          done();
        });
    });

    it("should return an error if food don't exist", done => {
      chai.request(server)
        .get(`/api/v1/foods/10000`)
        .end((err, response) => {
          response.should.have.status(404);
          response.body.error.should.equal(
            `Couldn't find food`
          );
          done();
        });
    });
  });


});
