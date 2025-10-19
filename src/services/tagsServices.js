// src/services/tagsServices.js
const db = require('../db');

// Create a new tag
exports.createTag = async (name) => {
  return await db('tags').insert({ name }).returning('*');
};
