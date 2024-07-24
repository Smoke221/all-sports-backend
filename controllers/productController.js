const connection = require("../configs/db");

// Helper function to check if a category exists
const categoryExists = async (categoryId) => {
  const [result] = await connection
    .promise()
    .query("SELECT * FROM categories WHERE id = ?", [categoryId]);
  return result.length > 0;
};

// Retrieve all products
/**
 * @swagger
 * paths:
 *   /products:
 *     get:
 *       summary: Retrieve all products
 *       description: Retrieves a list of all products from the database.
 *       tags:
 *         - Product
 *       responses:
 *         '200':
 *           description: A list of products
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Product ID
 *                     name:
 *                       type: string
 *                       description: Product name
 *                     price:
 *                       type: number
 *                       format: decimal
 *                       description: Product price
 *                     category_id:
 *                       type: integer
 *                       description: ID of the category associated with the product
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
exports.getProducts = async (req, res) => {
  try {
    const [products] = await connection
      .promise()
      .query("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Retrieve a specific product by ID
/**
 * @swagger
 *   /products/{id}:
 *     get:
 *       summary: Retrieve a specific product by ID
 *       description: Retrieves a specific product by its ID.
 *       tags:
 *         - Product
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the product to retrieve
 *           schema:
 *             type: integer
 *       responses:
 *         '200':
 *           description: Details of the product
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Product ID
 *                   name:
 *                     type: string
 *                     description: Product name
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     description: Product price
 *                   category_id:
 *                     type: integer
 *                     description: ID of the category associated with the product
 *         '400':
 *           description: Invalid product ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid product ID
 *         '404':
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Product not found
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
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

  try {
    const [product] = await connection
      .promise()
      .query("SELECT * FROM products WHERE id = ?", [id]);
    if (!product.length)
      return res.status(404).json({ error: "Product not found" });
    res.json(product[0]);
  } catch (err) {
    console.error("Error retrieving product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new product
/**
 * @swagger
 *   /products:
 *     post:
 *       summary: Create a new product
 *       description: Creates a new product with the provided name, price, and category ID.
 *       tags:
 *         - Product
 *       requestBody:
 *         description: Information for the new product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - price
 *                 - category_id
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The name of the new product
 *                 price:
 *                   type: number
 *                   format: decimal
 *                   description: The price of the new product
 *                 category_id:
 *                   type: integer
 *                   description: The ID of the category associated with the new product
 *       responses:
 *         '201':
 *           description: Product created successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the newly created product
 *                   name:
 *                     type: string
 *                     description: Name of the newly created product
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     description: Price of the newly created product
 *                   category_id:
 *                     type: integer
 *                     description: ID of the category associated with the new product
 *         '400':
 *           description: Invalid request body or category does not exist
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Product name is required and must be a non-empty string.
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
exports.createProduct = async (req, res) => {
  const { name, price, category_id } = req.body;

  // Basic validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({
      error: "Product name is required and must be a non-empty string.",
    });
  }
  if (isNaN(price) || price <= 0) {
    return res
      .status(400)
      .json({ error: "Product price must be a positive number." });
  }
  if (isNaN(category_id)) {
    return res
      .status(400)
      .json({ error: "Category ID must be a valid number." });
  }

  try {
    // Check if the category exists
    if (!(await categoryExists(category_id))) {
      return res.status(400).json({ error: "Category does not exist" });
    }

    // Insert the new product into the database
    const [result] = await connection
      .promise()
      .query(
        "INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)",
        [name, price, category_id]
      );
    res.status(201).json({ id: result.insertId, name, price, category_id });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an existing product by ID
/**
 * @swagger
 *   /products/{id}:
 *     put:
 *       summary: Update an existing product by ID
 *       description: Updates the name, price, and category ID of an existing product by its ID.
 *       tags:
 *         - Product
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the product to update
 *           schema:
 *             type: integer
 *       requestBody:
 *         description: Updated information for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: The new name of the product
 *                 price:
 *                   type: number
 *                   format: decimal
 *                   description: The new price of the product
 *                 category_id:
 *                   type: integer
 *                   description: The new category ID associated with the product
 *       responses:
 *         '200':
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID of the updated product
 *                   name:
 *                     type: string
 *                     description: New name of the product
 *                   price:
 *                     type: number
 *                     format: decimal
 *                     description: New price of the product
 *                   category_id:
 *                     type: integer
 *                     description: New category ID associated with the product
 *         '400':
 *           description: Invalid product ID or request body
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Product name must be a non-empty string or Category ID must be a valid number.
 *         '404':
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Product not found
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
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category_id } = req.body;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

  // Basic validation
  if (name && (typeof name !== "string" || name.trim().length === 0)) {
    return res
      .status(400)
      .json({ error: "Product name must be a non-empty string." });
  }
  if (price && (isNaN(price) || price <= 0)) {
    return res
      .status(400)
      .json({ error: "Product price must be a positive number." });
  }
  if (category_id && isNaN(category_id)) {
    return res
      .status(400)
      .json({ error: "Category ID must be a valid number." });
  }

  try {
    // Check if the product exists
    const [existingProduct] = await connection
      .promise()
      .query("SELECT * FROM products WHERE id = ?", [id]);
    if (!existingProduct.length)
      return res.status(404).json({ error: "Product not found" });

    // Check if the category exists if category_id is provided
    if (category_id && !(await categoryExists(category_id))) {
      return res.status(400).json({ error: "Category does not exist" });
    }

    // Update the product in the database
    const [result] = await connection
      .promise()
      .query(
        "UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?",
        [name, price, category_id, id]
      );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json({ id, name, price, category_id });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a product by ID
/**
 * @swagger
 *   /products/{id}:
 *     delete:
 *       summary: Delete a product by ID
 *       description: Deletes a product by its ID.
 *       tags:
 *         - Product
 *       parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the product to delete
 *           schema:
 *             type: integer
 *       responses:
 *         '204':
 *           description: Product deleted successfully
 *         '400':
 *           description: Invalid product ID
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Invalid product ID
 *         '404':
 *           description: Product not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Product not found
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
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) return res.status(400).json({ error: "Invalid product ID" });

  try {
    // Delete the product from the database
    const [result] = await connection
      .promise()
      .query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Product not found" });

    res.status(204).end(); // No content to return
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
