exports.up = function (knex) {
  return Promise.all([
    knex.schema.alterTable('products', function (table) {
      table.timestamp('deleted_at').nullable().defaultTo(null);
    }),

    knex.schema.alterTable('product_tags', function (table) {
      table.timestamp('deleted_at').nullable().defaultTo(null);
    }),

    knex.schema.alterTable('inventory', function (table) {
      table.timestamp('deleted_at').nullable().defaultTo(null);
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.alterTable('products', function (table) {
      table.dropColumn('deleted_at');
    }),

    knex.schema.alterTable('product_tags', function (table) {
      table.dropColumn('deleted_at');
    }),

    knex.schema.alterTable('inventory', function (table) {
      table.dropColumn('deleted_at');
    }),
  ]);
};
