const pry = require('pryjs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const mealNotation = require('./module');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin",
    "*");
  response.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  response.header("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

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
    .update({'name': food.name , 'calories': food.calories}, ['name', 'calories', 'id'])
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


app.get('/api/v1/meals/', (request, response) => {
  database('meals')
  .select(['meals.id AS mealId', 'meals.name AS mealName', 'foods.* AS foods'])
  .join('mealFoods','mealFoods.meal_id' , 'meals.id' )
  .join('foods','foods.id' , 'mealFoods.food_id')
    .then((meals) => {
      var output = mealsNotation(meals);
      response.status(200).json(output);
    })
    .catch((error) => {
      response.status(404).json( {error});
    });
});

app.get('/api/v1/meals/:id/foods', (request, response) => {
  database('meals')
    .where('meals.id', request.params.id)
    .select(['meals.id AS mealId', 'meals.name AS mealName', 'foods.* AS foods'])
    .join('mealFoods','mealFoods.meal_id' , 'meals.id' )
    .join('foods','foods.id' , 'mealFoods.food_id')
      .then((meal) => {
        var output = singleMeal(meal);
        response.status(200).json(output);
      })
      .catch((error) => {
        response.status(404).json( {error});
      })
})

app.delete('/api/v1/meals/:meal_id/foods/:food_id', (request, response) => {
  database('mealFoods')
  .select('mealFoods.id AS id')
  .where('food_id', request.params.food_id)
  .andWhere('meal_id', request.params.meal_id)
  .del()
    .then((data) => {
      response.status(204).json();
    })
    .catch((error) =>{
      response.status(404).json({error});
    })
});


function mealsNotation(meals) {
  const brea  = {"id": 1 , "name": "Breakfast" , "foods": [] }
  const lunch  = {"id": 3 , "name": "Lunch" , "foods": [] }
  const dinner = {"id": 4 , "name": "Dinner" , "foods": [] }
  const snacks  = {"id": 2 , "name": "Snacks" , "foods": [] }
  var format = [];
   meals.map(object => {
    if(object.mealName === "Breakfast"){
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      brea.foods.push(food);
    }
    else if (object.mealName === "Snacks") {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      snacks.foods.push(food);

    }
    else if (object.mealName === "Lunch" ) {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      lunch.foods.push(food);

    }
    else if (object.mealName === "Dinner" ) {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      dinner.foods.push(food);
    }
  });
  format.push(brea, snacks, lunch, dinner);
  return format;
}

function singleMeal(meal) {
  const breakfast  = {"id": 1 , "name": "Breakfast" , "foods": [] }
  const lunch  = {"id": 3 , "name": "Lunch" , "foods": [] }
  const dinner = {"id": 4 , "name": "Dinner" , "foods": [] }
  const snacks  = {"id": 2 , "name": "Snacks" , "foods": [] }
  var format = [];
   meal.map(object => {
    if(object.mealName === "Breakfast"){
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      breakfast.foods.push(food);
    }
    else if (object.mealName === "Snacks") {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      snacks.foods.push(food);

    }
    else if (object.mealName === "Lunch" ) {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      lunch.foods.push(food);

    }
    else if (object.mealName === "Dinner" ) {
      food = { "id": object.id, "name": object.name, "calories": object.calories }
      dinner.foods.push(food);
    }
  });

  var single = null
  if(meal[0].mealId === 1 ) {
    single= breakfast;
  }
  else if(meal[0].mealId === 2 ) {
    single= snacks;
  }
  else if(meal[0].mealId === 3 ) {
    single= lunch;
  }
  else if(meal[0].mealId === 4 ) {
    single= dinner;
  }

  return single;
}

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
