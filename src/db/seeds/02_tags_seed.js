exports.seed = async function (knex) {
  await knex('tags').del();

  return knex('tags').insert([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Footwear' },
    { id: 3, name: 'Accessories' },
    { id: 4, name: 'Sale' }
  ]);
};
