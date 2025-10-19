// src/services/productsServices.js
const db = require('../db');

const productService = {
  // Create Product with Tags + Initial Stock
  async createProductWithStockAndTags(productData, tags = [], initialStock = 0) {
    return await db.transaction(async (trx) => {
      // Insert product (starts at 0 stock)
      const [product] = await trx('products')
        .insert(productData)
        .returning('*');

      const productId = product.id;

      // Attach tags
      if (tags && tags.length > 0) {
        const tagLinks = tags.map((tagId) => ({
          product_id: productId,
          tag_id: tagId,
          deleted_at: null
        }));
        await trx('product_tags').insert(tagLinks);
      }

      // If initialStock > 0, log inventory + update stock
      if (initialStock > 0) {
        await trx('inventory').insert({
          product_id: productId,
          type: 'in',
          quantity: initialStock,
          deleted_at: null
        });

        await trx('products')
          .where('id', productId)
          .update({ current_stock: initialStock });
      }

    // Fetch full product
const fetchedProduct = await trx('products').where('id', productId).first();

      const productTags = await trx('product_tags')
        .join('tags', 'product_tags.tag_id', 'tags.id')
        .where('product_tags.product_id', productId)
        .whereNull('product_tags.deleted_at')
        .select('tags.id', 'tags.name');

      return { ...fetchedProduct, tags: productTags };
    });
  },
// Add inside productService object
async adjustStockWithTransaction(productId, type, quantity) {
  return await db.transaction(async (trx) => {
    // Check if product exists and is NOT soft deleted
    const product = await trx('products')
      .where({ id: productId })
      .whereNull('deleted_at')
      .first();

    if (!product) throw new Error("Product not found or has been deleted");

    // Calculate next stock value
    let newStock = product.current_stock;
    if (type === 'in') {
      newStock += quantity;
    } else if (type === 'out') {
      newStock -= quantity;
    }

    // Prevent negative stock
    if (newStock < 0) {
      throw new Error("Stock level cannot go below zero. Transaction rolled back.");
    }

    // Insert into inventory log
    await trx('inventory').insert({
      product_id: productId,
      type,
      quantity,
      deleted_at: null
    });

    // Update product stock
    await trx('products')
      .where({ id: productId })
      .update({ current_stock: newStock, updated_at: new Date() });

    // Return updated product with stock and tags
    const updatedProduct = await trx('products')
      .where({ id: productId })
      .first();

    const tags = await trx('product_tags')
      .join('tags', 'product_tags.tag_id', 'tags.id')
      .where('product_tags.product_id', productId)
      .whereNull('product_tags.deleted_at')
      .select('tags.id', 'tags.name');

    return { ...updatedProduct, tags };
  });
},

  
  // Get all products
  async getAllProducts(filters = {}) {
  const { tag, min_stock, name } = filters;

  let query = db('products')
    .whereNull('deleted_at')
    .select('products.*');

  // Apply stock filter
  if (min_stock) {
    query = query.where('current_stock', '>=', min_stock);
  }

  // Apply name search filter (case-insensitive)
  if (name) {
    query = query.whereILike('products.name', `%${name}%`);
  }

  let products = await query;

  // If tag filter exists, apply join only then
  if (tag) {
    const taggedProducts = await db('product_tags')
      .join('tags', 'product_tags.tag_id', 'tags.id')
      .whereILike('tags.name', `%${tag}%`)
      .whereNull('product_tags.deleted_at')
      .select('product_tags.product_id');

    const filteredIds = taggedProducts.map((item) => item.product_id);
    products = products.filter((p) => filteredIds.includes(p.id));
  }

  // Attach tags to each product
  const result = await Promise.all(
    products.map(async (product) => {
      const tags = await db('product_tags')
        .join('tags', 'product_tags.tag_id', 'tags.id')
        .where('product_tags.product_id', product.id)
        .whereNull('product_tags.deleted_at')
        .select('tags.id', 'tags.name');

      return { ...product, tags };
    })
  );

  return result;
},

  // Get single product
  async getProductById(id) {
    const product = await db('products')
      .where({ id })
      .whereNull('deleted_at')
      .first();

    if (!product) return null;

    const tags = await db('product_tags')
      .join('tags', 'product_tags.tag_id', 'tags.id')
      .where('product_tags.product_id', id)
      .whereNull('product_tags.deleted_at')
      .select('tags.id', 'tags.name');

    return { ...product, tags };
  },

  // Update product
  async updateProduct(id, updates) {
    updates.updated_at = new Date();

    return await db('products')
      .where({ id })
      .whereNull('deleted_at')
      .update(updates)
      .returning('*');
  },

  // Soft delete product + related tags + inventory
  async softDeleteProduct(id) {
    const now = new Date();

    return await db.transaction(async (trx) => {
      await trx('products')
        .where({ id })
        .update({ deleted_at: now });

      await trx('product_tags')
        .where({ product_id: id })
        .update({ deleted_at: now });

      await trx('inventory')
        .where({ product_id: id })
        .update({ deleted_at: now });

      return true;
    });
  }
};

module.exports = productService;
