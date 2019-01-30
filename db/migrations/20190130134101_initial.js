
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('foods', function(t) {
      t.increments('id').primary();
      t.string('name');
      t.integer('calories');

      t.timestamps(true, true);
      })
  ]);

};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('foods')
  ])
};
