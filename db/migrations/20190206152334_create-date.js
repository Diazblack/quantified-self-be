
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('dates', function(t) {
      t.increments('id').primary();
      t.string('date_str');
      t.integer('goal');
      t.integer('consumed');
      t.integer('remaining');
      t.json('meals');
      })
  ]);

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('dates')
  ])
};
