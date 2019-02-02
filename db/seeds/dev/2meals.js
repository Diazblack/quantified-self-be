exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE meals RESTART IDENTITY CASCADE')
    .then(() => {
      return Promise.all([
        knex('meals').insert([
          {name: 'Breakfast'},
          {name: 'Lunch'},
          {name: 'Dinner'},
          {name: 'Snacks'}
        ])
        .then(() => console.log('Meals seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
