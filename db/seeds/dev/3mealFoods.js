
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('mealFoods').del()
    .then(() => {
      return Promise.all([
        knex('mealFoods').insert([
          {meal_id: 1, food_id: 1 },
          {meal_id: 1, food_id: 6 },
          {meal_id: 3, food_id: 2 },
          {meal_id: 3, food_id: 4 },
          {meal_id: 4, food_id: 5 },
          {meal_id: 4, food_id: 7 },
          {meal_id: 2, food_id: 3 },
        ])
        .then(() => console.log('mealFoods seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
