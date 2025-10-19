exports.seed = async function (knex) {
  await knex('inventory').del();

  return knex('inventory').insert([
    { id: 1, product_id: 1, type: 'in', quantity: 50 },
    { id: 2, product_id: 2, type: 'in', quantity: 30 },
    { id: 3, product_id: 3, type: 'in', quantity: 20 },
    { id: 4, product_id: 2, type: 'out', quantity: 2 }
  ]);
};
