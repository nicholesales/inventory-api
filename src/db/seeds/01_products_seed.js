exports.seed = async function (knex) {
  await knex('products').del();

  return knex('products').insert([
    { id: 1, name: 'Laptop', description: 'High performance laptop', current_stock: 50 },
    { id: 2, name: 'Running Shoes', description: 'Comfortable sports shoes', current_stock: 28 },
    { id: 3, name: 'Wireless Mouse', description: 'Bluetooth mouse with silent click', current_stock: 20 }
  ]);
};
