
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE foods RESTART IDENTITY CASCADE')
    .then(() => {
      return Promise.all([
        knex('foods').insert([
          {name: 'Tea', calories: 100},
          {name: 'Pizza Slice', calories: 330},
          {name: 'Cake', calories: 400},
          {name: 'Avocado', calories: 250},
          {name: 'Salad', calories: 250},
          {name: 'Donut', calories: 250},
          {name: 'Burger', calories: 700},
          {name: 'Cauliflower', calories: 50}
        ])
        .then(() => console.log('Food seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
