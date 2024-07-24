const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../configs/db");

// Register a new user
/**
 * @swagger
 * paths:
 *   /auth/register:
 *     post:
 *       summary: Register a new user
 *       description: Registers a new user by providing name, email, and password. Returns a success message if the registration is successful.
 *       tags:
 *         - User
 *       requestBody:
 *         description: User registration information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - name
 *                 - email
 *                 - pass
 *               properties:
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                 pass:
 *                   type: string
 *                   description: User's password
 *       responses:
 *         '201':
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User registered successfully
 *         '400':
 *           description: Bad request, e.g., email already registered
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Email already registered
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
exports.register = async (req, res) => {
  const { name, email, pass } = req.body;

  try {
    // Check if the user already exists
    const [users] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Insert the new user into the database
    await connection
      .promise()
      .query("INSERT INTO users (name, email, pass) VALUES (?, ?, ?)", [
        name,
        email,
        hashedPassword,
      ]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
/**
 * @swagger
 * paths:
 *   /auth/login:
 *     post:
 *       summary: Login user
 *       description: Authenticates a user with the provided email and password. Returns a JWT token if the credentials are valid.
 *       tags:
 *         - User
 *       requestBody:
 *         description: User login information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - email
 *                 - pass
 *               properties:
 *                 email:
 *                   type: string
 *                   description: User's email address
 *                 pass:
 *                   type: string
 *                   description: User's password
 *       responses:
 *         '200':
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Login Success.
 *                   token:
 *                     type: string
 *                     description: JWT token
 *         '400':
 *           description: Bad request, e.g., user not found or invalid credentials
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found
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
exports.login = async (req, res) => {
  const { email, pass } = req.body;

  try {
    // Find the user by email
    const [users] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);
    if (!users.length) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = users[0];

    // Compare the provided password with the stored hashed password.
    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login Success.", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
