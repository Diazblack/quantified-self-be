
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE dates RESTART IDENTITY CASCADE')
    .then(() => {
      return Promise.all([
        knex('dates').insert([
          {
            date_str: '2018-02-05',
            goal: 2000,
            consumed: 1600,
            remaining: 400,
            meals: JSON.stringify([
              {id: 1, name: 'Breakfast', foods: [{id: 1, name: 'Tea', calories: 200}]},
              {id: 2, name: 'Snacks', foods: [{id: 8, name: 'Fries', calories: 600}]},
              {id: 3, name: 'Lunch', food:[{id: 9, name: 'Shawarma', calories: 600}]},
              {id: 4, name: 'Dinner', food:[{id: 10, name: 'Salad', calories: 400}]}
            ])
          },
          {
            date_str: '2018-02-06',
            goal: 2000,
            consumed: 1900,
            remaining: 100,
            meals: JSON.stringify([
              {id: 1, name: 'Breakfast', foods: [{id: 1, name: 'Tea', calories: 200}]},
              {id: 2, name: 'Snacks', foods: [{id: 11, name: 'Nuts', calories: 300}]},
              {id: 3, name: 'Lunch', food:[{id: 12, name: 'Paella', calories: 1000}]},
              {id: 4, name: 'Dinner', food:[{id: 13, name: 'Ceviche', calories: 400}]}
            ])
          }
        ])
        .then(() => console.log('Dates seeding complete'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`))
};
