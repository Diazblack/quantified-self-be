const pry = require('pryjs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'quantified_self';

app.post('/api/v1/foods', (req, res) => {
  const food = req.body;
  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]){
      return res
        .status(400)
        .send({ error: `Expected format: { name: <String>, calories: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('foods').insert( food , 'id')
  .then( food => {
    res.status(201).json({id: food[0] })
  })
  .catch( error => {
    res.status(500).json({ error });
  });
});

module.exports = app;
