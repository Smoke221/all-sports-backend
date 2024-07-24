const connection = require("../configs/db");

// Helper function to check if a category exists
const categoryExists = async (name) => {
  const [result] = await connection
    .promise()
    .query("SELECT * FROM categories WHERE name = ?", [name]);
  return result.length > 0;
};

// Retrieve all categories
/**
 * @swagger
 * paths:
 *   /categories:
 *     get:
 *       summary: Retrieve all categories
 *       description: Retrieves a list of all categories from the database.
 *       tags:
 *         - Category
 *       responses:
 *         '200':
 *           description: A list of categories
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Category ID
 *                     name:
 *                       type: string
 *                       description: Category name
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await connection
      .promise()
      .query("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    console.error("Error retrieving categories:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve a specific category by ID
/**
 * @swagger
 *   /categories/{id}:
 *     get:
 *       summary: Retrieve a specific category by ID
 *       description: Retrieves a specific category by its ID.
 *       tags:
 *         - Category
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the category to retrieve
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Details of the category
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Category ID
 *                   name:
 *                     type: string
 *                     description: Category name
 *         '400':
 *           description: Invalid category ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid category ID
 *         '404':
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Category not found
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid category ID" });

  try {
    const [category] = await connection
      .promise()
      .query("SELECT * FROM categories WHERE id = ?", [id]);
    if (!category.length)
      return res.status(404).json({ error: "Category not found" });
    res.json(category[0]);
  } catch (err) {
    console.error("Error retrieving category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new category
/**
 * @swagger
 *   /categories:
 *     post:
 *       summary: Create a new category
 *       description: Creates a new category with the provided name.
 *       tags:
 *         - Category
 *       requestBody:
 *         description: Information for the new category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the new category
 *       responses:
 *         '201':
 *           description: Category created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the newly created category
 *                   name:
 *                     type: string
 *                     description: Name of the newly created category
 *         '400':
 *           description: Invalid request body or category already exists
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Category name is required and must be a non-empty string.
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */
exports.createCategory = async (req, res) => {
  const { name } = req.body;

  // Basic validation for non-empty name
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "Category name is required and must be a non-empty string.",
    });
  }

  try {
    // Check if the category already exists
    if (await categoryExists(name)) {
      return res.status(400).json({ error: "Category already exists" });
    }

    // Insert the new category into the database
    const [result] = await connection
      .promise()
      .query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing category by ID
/**
 * @swagger
 *   /categories/{id}:
 *     put:
 *       summary: Update an existing category by ID
 *       description: Updates the name of an existing category by its ID.
 *       tags:
 *         - Category
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the category to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         description: Updated information for the category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The new name of the category
 *       responses:
 *         '200':
 *           description: Category updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the updated category
 *                   name:
 *                     type: string
 *                     description: New name of the category
 *         '400':
 *           description: Invalid category ID or request body
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid category ID or Category name is required and must be a non-empty string.
 *         '404':
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Category not found
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid category ID" });

  // Basic validation for non-empty name
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "Category name is required and must be a non-empty string.",
    });
  }

  try {
    // Check if the category exists
    const [existingCategory] = await connection
      .promise()
      .query("SELECT * FROM categories WHERE id = ?", [id]);
    if (!existingCategory.length)
      return res.status(404).json({ error: "Category not found" });

    // Update the category in the database
    const [result] = await connection
      .promise()
      .query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category not found" });

    res.json({ id, name });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a category by ID
/**
 * @swagger
 *   /categories/{id}:
 *     delete:
 *       summary: Delete a category by ID
 *       description: Deletes a category by its ID.
 *       tags:
 *         - Category
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the category to delete
 *           schema:
 *             type: integer
 *       responses:
 *         '204':
 *           description: Category deleted successfully
 *         '400':
 *           description: Invalid category ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid category ID
 *         '404':
 *           description: Category not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Category not found
 *         '500':
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error
 */
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid category ID" });

  try {
    // Check if the category exists before attempting to delete
    const [result] = await connection
      .promise()
      .query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Category not found" });

    res.status(204).end(); // No content to return
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
