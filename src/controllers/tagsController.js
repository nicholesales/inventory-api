const { successResponse, errorResponse } = require('../utils/response');
const tagService = require('../services/tagsServices');

// @desc Create a new tag
// @route POST /api/tags
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return errorResponse(res, "Tag name is required", 400);

    const [tag] = await tagService.createTag(name);
    return successResponse(res, "Tag created", tag, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Failed to create tag", 500);
  }
};
