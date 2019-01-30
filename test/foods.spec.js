const pry = require('pryjs');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../lib/index');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

// As a user,
// When I
// POST /api/v1/foods
// with the parameters:
// { "food": { "name": "Name of food here", "calories": "Calories here"} }
//
// The a food item is created and the food item will be returned.
// If the food is not successfully created, a 400 status code will be returned.
// Both name and calories are required fields.

describe('API routes', () => {

  before((done) => {
    database.migrate.latest()
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
});
