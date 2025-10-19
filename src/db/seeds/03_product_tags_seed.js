exports.seed = async function (knex) {
  await knex('product_tags').del();

  return knex('product_tags').insert([
    { id: 1, product_id: 1, tag_id: 1 }, // Laptop - Electronics
    { id: 2, product_id: 2, tag_id: 2 }, // Running Shoes - Footwear
    { id: 3, product_id: 3, tag_id: 3 }, // Mouse - Accessories
    { id: 4, product_id: 2, tag_id: 4 }  // Shoes - Sale
  ]);
};
