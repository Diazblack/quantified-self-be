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

  database('foods').insert( food , '*')
  .then( food => {
    res.status(201).json({ id: food[0].id, name: food[0].name, calories: food[0].calories })
  })
  .catch( error => {
    res.status(500).json({ error });
  });
});

app.get('/api/v1/foods/', (request, response) => {
  database('foods').select()
    .then((foods) => {
      response.status(200).json(foods);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).select()
    .then(food => {
      if(food.length){
        response.status(200).json(food);
      }
      else {
        response.status(404).json({
          error: `Couldn't find food`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
  });

app.patch('/api/v1/foods/:id', (request, response) => {
  const food = request.body;
  for (let requiredParameter of ['name', 'calories']) {
    if (!food[requiredParameter]){
      return response
        .status(400)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    }
  }
  database('foods')
    .where('id', request.params.id)
    .update({'name': food.name , 'calories': food.calories}, ['name', 'calories'])
    .then(food => {
      if(food) {
        response.status(200).json(food);
      }
      else {
        response.status(404).json({
        error: `Couldn't find food`
        })
      }
    })
  });

app.delete('/api/v1/foods/:id', (request, response) => {
  database('foods').where('id', request.params.id).del()
    .then(food => {
      if(food) {
        response.status(204).json({success: true});
      }
      else {
        response.status(404).json({ error });
      }
    })
    .catch(error => {
      response.status(404).json({error});
    });
});

app.post('/api/v1/meals/:meal_id/foods/:id', (request, response) => {
  database('mealFoods').insert({meal_id: request.params.meal_id, food_id: request.params.id })
    .then(() => {
      database('mealFoods')
      .where('food_id', request.params.id)
      .where('meal_id', request.params.meal_id)
      .join('meals', 'mealFoods.meal_id', 'meals.id' )
      .join('foods', 'mealFoods.food_id', 'foods.id' )
      .select('foods.name AS food', 'meals.name AS meal')
      .first()
        .then(data => {
          response.status(201).json({"message": `Successfully added ${data.food} to ${data.meal}`});
        })
        .catch(error => {
          response.status(404).json({ error });
        })
  })
  .catch(error => {
    response.status(404).json({ error });
  })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
