exports.up = function (knex) {
  return knex.schema.createTable('product_tags', (table) => {
    table.increments('id').primary();
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
    table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE');
    table.unique(['product_id', 'tag_id']); // prevents duplicate associations
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('product_tags');
};
