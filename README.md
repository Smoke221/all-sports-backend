# E-Commerce Application for Allsport.in Backend Engineer Position

## Overview

This is an e-commerce application with RESTful API endpoints to manage products and categories. It includes functionality for user registration and login using JWT for authentication.

---

## Project Setup

### Prerequisites

- Node.js (v14.x or later)
- MySQL (v8.x or later)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Smoke221/all-sports-backend
   cd all-sports-backend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. Setup Environment Variables

   Create a `.env` file in the root directory of the project and add the following variables:

   ```plaintext
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=your_mysql_database
   JWT_SECRET=your_jwt_secret
   ```

4. **Database Setup**
   Make sure MySQL is running and create the required database and tables. You can use the provided SQL scripts or manually create them.

   Example SQL for creating categories and products tables:

   ```
   CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
   );

   CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
   );
   ```
5. **Start the application**
   ```
   npm start
   ```


## API Endpoints

Try out using Swagger [here](http://localhost:5700/api-docs/#/)

### Authentication

- **Register a New User**
  - **Endpoint:** `POST /auth/register`

- **Login User**
  - **Endpoint:** `POST /auth/login`

### Categories

- **Retrieve All Categories**
  - **Endpoint:** `GET /categories`

- **Retrieve a Category by ID**
  - **Endpoint:** `GET /categories/{id}`

- **Create a New Category**
  - **Endpoint:** `POST /categories`

- **Update a Category by ID**
  - **Endpoint:** `PUT /categories/{id}`

- **Delete a Category by ID**
  - **Endpoint:** `DELETE /categories/{id}`

### Products

- **Retrieve All Products**
  - **Endpoint:** `GET /products`

- **Retrieve a Product by ID**
  - **Endpoint:** `GET /products/{id}`

- **Create a New Product**
  - **Endpoint:** `POST /products`

- **Update a Product by ID**
  - **Endpoint:** `PUT /products/{id}`

- **Delete a Product by ID**
  - **Endpoint:** `DELETE /products/{id}`
