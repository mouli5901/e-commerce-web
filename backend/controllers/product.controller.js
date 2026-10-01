const Product = require('../models/product.model');

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required field' });
    }
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock' });
    }
    const product = await Product.create({ name, description, price, category, image, stock });
    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All' && category !== 'All Categories') {
      filter.category = category;
    }
    const products = await Product.find(filter).select('-__v -createdAt');
    return res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    const product = await Product.findById(id).select('-__v -createdAt');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createProduct, getAllProducts, getProductById };
