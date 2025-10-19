const { successResponse, errorResponse } = require('../utils/response');
const productService = require('../services/productsServices');

// @desc Create product with initial stock + tags
// @route POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, tags, initialStock } = req.body;
    if (!name) return errorResponse(res, "Product name is required", 400);

    const productData = {
      name,
      description: description || "",
      current_stock: 0 // always starts at 0
    };

    const product = await productService.createProductWithStockAndTags(
      productData,
      tags,
      initialStock
    );

    return successResponse(res, "Product created successfully", product, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to create product", 500);
  }
};

// @desc Get all products
// @route GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const filters = {
      tag: req.query.tag || null,
      min_stock: req.query.min_stock || null,
      name: req.query.name || null
    };

    const products = await productService.getAllProducts(filters);
    return successResponse(res, "Products retrieved", products);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch products", 500);
  }
};


// @desc Get single product
// @route GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
    if (!product) return errorResponse(res, "Product not found", 404);

    return successResponse(res, "Product retrieved", product);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to fetch product", 500);
  }
};

// @desc Update product name/description
// @route PATCH /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await productService.updateProduct(id, updates);
    if (!updated.length) return errorResponse(res, "Product not found", 404);

    return successResponse(res, "Product updated", updated[0]);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to update product", 500);
  }
};

// @desc Soft delete product & related records
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.softDeleteProduct(id);
    return successResponse(res, "Product softly deleted");
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to delete product", 500);
  }
};

// @desc Adjust stock (in or out) with transaction + rollback on negative
// @route POST /api/products/:id/stock
exports.adjustStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, quantity } = req.body;

    if (!type || !['in', 'out'].includes(type)) {
      return errorResponse(res, "Type must be 'in' or 'out'", 400);
    }

    if (!quantity || quantity <= 0) {
      return errorResponse(res, "Quantity must be a positive number", 400);
    }

    const result = await productService.adjustStockWithTransaction(id, type, quantity);

    return successResponse(res, "Stock updated successfully", result);
  } catch (err) {
    console.error(err);
    return errorResponse(res, err.message || "Failed to update stock", 500);
  }
};
