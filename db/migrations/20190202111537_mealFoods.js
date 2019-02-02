
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('mealFoods', function(t) {
      t.increments('id').primary();
      t.integer('meal_id').unsigned()
      t.foreign('meal_id')
        .references('meals.id');
      t.integer('food_id').unsigned()
      t.foreign('food_id')
        .references('foods.id');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('mealFoods')
  ])
};
