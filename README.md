# Inventory Management API

## Project Overview
This is a production-style Inventory Management REST API built with Node.js, Express, Knex.js, and PostgreSQL. It demonstrates CRUD operations, database normalization, many-to-many relationships (products and tags), inventory stock tracking with transactions, and advanced filtering. API testing was done using Thunder Client.

## Requirements
- Node.js installed
- PostgreSQL installed and running
- Git installed
- Thunder Client or Postman for API testing

## Clone Repository
- git clone <https://github.com/nicholesales/inventory-api>
- cd inventory-api

## Install Dependencies
- npm install express knex pg dotenv
- npm install --save-dev nodemon

## Nodemon Setup
- Nodemon is used for development. The package.json already contains:
"scripts": {
  "dev": "nodemon src/index.js"
}

- Run using:
npm run dev

## Environment Setup
- Create a .env file in the root of the project with the following:
PORT=3000
DB_HOST=localhost
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_NAME=inventory_db
DB_PORT=5432

- Make sure PostgreSQL has a database created with the same name as DB_NAME.

## Knex Configuration
- The knexfile.js is already configured to read from the .env file and connect to PostgreSQL. No action is required unless you change database credentials.

## Run Database Migrations
To create the required tables using Knex migrations:
- npx knex migrate:latest

## Run Seed Data (Optional but recommended for testing)
This inserts initial sample data for products, tags, and inventory.
- npx knex seed:run

## Start the Server
Development mode with auto-restart:
- npm run dev

## API Testing Using Thunder Client
The following endpoints are available and were tested using Thunder Client.

Create Product (with tags and initial stock using transaction)
POST http://localhost:3000/api/products
Body example:
{
  "name": "Sample Product",
  "description": "Test product",
  "initial_stock": 10,
  "tags": ["Electronics", "Sale"]
}

Get Single Product with tags and stock
GET http://localhost:3000/api/products/1

Get All Products with Filters
GET http://localhost:3000/api/products?tag=Electronics&min_stock=5&name=sample

Update Product Name or Description
PATCH http://localhost:3000/api/products/1
Body example:
{
  "name": "Updated Name"
}

Delete Product (cascades to inventory and tag link table)
DELETE http://localhost:3000/api/products/1

Create Inventory Record (Transaction to update stock atomically)
POST http://localhost:3000/api/products/1/stock
Body example:
{
  "type": "in",
  "quantity": 5
}

Note: If type is "out" and quantity exceeds current stock, the transaction will rollback automatically server-side.

Create Tag
POST http://localhost:3000/api/tags
Body example:
{
  "name": "Footwear"
}

## Database Relations Recap
Products to Tags is many-to-many through the product_tags link table.
Products to Inventory is one-to-many through the inventory table.
current_stock in products table is maintained and updated on every stock adjustment.

## Running Order Summary
1. git clone repo
2. npm install express knex pg dotenv
3. npm install --save-dev nodemon
4. Create .env
5. Ensure PostgreSQL database exists
6. Run npx knex migrate:latest
7. Run npx knex seed:run (optional)
8. Start server using npm run dev
9. Test API using Thunder Client

## Notes
If migrations or seeds fail, ensure database credentials are correct and tables do not already exist. To rollback and re-run migrations:
- npx knex migrate:rollback
- npx knex migrate:latest

