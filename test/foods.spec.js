
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

  describe('PATCH /api/v1/foods/id', () => {
    it("should update a specific food by id", done => {
      chai.request(server)
        .patch(`/api/v1/foods/2`)
        .send({
          name: 'Coliflower',
          calories: '10000000'
        })
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Coliflower');
          response.body[0].should.have.property('calories');
          response.body[0].calories.should.equal(10000000);
          done();
        });
    });

    it("should return an error if a field is missing", done => {
      chai.request(server)
        .patch(`/api/v1/foods/2`)
        .send({
          name: 'Coliflower'
        })
        .end((err, response) => {
          response.should.have.status(400);
          response.body.error.should.equal(
            `You're missing a "calories" property.`
          );
          done();
        });
    });
  });

  describe('DELETE /api/v1/foods/:id', () => {
    it("should delete food from the db by id", done => {
      chai.request(server)
        .delete('/api/v1/foods/8')
        .end((err, response) => {
          response.should.have.status(204);
          done();
        });
    });

    it("should food with id don't exist return 404", done => {
      chai.request(server)
        .delete('/api/v1/foods/20')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('POST /api/v1/meals/:meal_id/foods/:id', () => {
    it('should add food by id to a meal using meal_is', done => {
      chai.request(server)
      .post('/api/v1/meals/1/foods/1')
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('message');
        response.body.message.should.equal('Successfully added Tea to Breakfast');
        done();
      });
    });

    it("should return 404 if the meal with id don't exit", done => {
      chai.request(server)
        .post('/api/v1/meals/10/foods/1')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    });

    it("should return 404 if the food with id don't exit", done => {
      chai.request(server)
        .post('/api/v1/meals/1/foods/20')
        .end((err, response) => {
          response.should.have.status(404);
          done();
      });
    });
  });

  describe('GET /api/v1/meals', () => {
    it("should return all the meals in the db with their foods", done => {
      chai.request(server)
        .get('/api/v1/meals/')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Breakfast');
          response.body[0].should.have.property('foods');
          response.body[0].foods[0].should.have.property('name');
          response.body[0].foods[0].name.should.equal('Tea');
          done();
        });
    });
  });

  describe('GET /api/v1/meals/:id/foods', () => {
    it("should return an specific meal by id  with their foods", done => {
      chai.request(server)
        .get('/api/v1/meals/3/foods')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.have.property('name');
          response.body.name.should.equal('Lunch');
          response.body.should.have.property('foods');
          response.body.foods[1].should.have.property('name');
          response.body.foods[1].name.should.equal('Avocado');
          response.body.foods[0].should.have.property('name');
          response.body.foods[0].name.should.equal('Pizza Slice');
          done();
        });
    });

    it("should return 404 if the meal with id don't exit", done => {
      chai.request(server)
        .post('/api/v1/meals/1000/foods/')
        .end((err, response) => {
          response.should.have.status(404);
          done();
      });
    });
  });

  describe('DELETE /api/v1/meals/:meal_id/foods/:id', () =>{
    it("should delete a food asociate with a meal using both id's", done => {
      chai.request(server)
        .delete('/api/v1/meals/3/foods/2')
        .end((err, response) => {
          response.should.have.status(204);
          done();
        });
    });

  })

  describe('POST /api/v1/calendar/', () => {
    it('should create a new date in the calendar', done => {
      chai.request(server)
      .post('/api/v1/calendar')
      .send({
        date_str: '2018-02-07',
        goal: 2000,
        consumed: 1800,
        remaining: 200,
        meals: [
          {id: 1, name: 'Breakfast', foods: [{id: 1, name: 'Tea', calories: 100}]},
          {id: 2, name: 'Snacks', foods: [{id: 3, name: 'Cake', calories: 300}]},
          {id: 3, name: 'Lunch', food:[{id: 5, name: 'Salad', calories: 400}]},
          {id: 4, name: 'Dinner', food:[{id: 7, name: 'Burger', calories: 1000}]}
        ]
      })
      .end((err, response) => {
        response.should.have.status(201);
        done();

      })
    })
  })

  describe('GET /api/v1/calendar/', () => {
    it('should return all the dates', done => {
      chai.request(server)
      .get('/api/v1/calendar/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('date_str');
        response.body[0].date_str.should.equal('2018-02-05');
        response.body[0].should.have.property('goal');
        response.body[0].goal.should.equal(2000);
        response.body[0].should.have.property('consumed');
        response.body[0].consumed.should.equal(1600);
        response.body[0].should.have.property('remaining');
        response.body[0].remaining.should.equal(400);
        response.body[0].should.have.property('meals');
        response.body[0].meals.should.be.a('array');
        response.body[0].meals[0].should.have.property('id');
        response.body[0].meals[0].id.should.equal(1);
        done();
      })
    })
  })
});
