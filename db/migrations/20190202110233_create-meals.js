
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('meals', function(t) {
      t.increments('id').primary();
      t.string('name');

      t.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('meals')
  ])
};
