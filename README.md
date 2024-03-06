# Inventory Management API

A backend API for managing inventory in a store. It allows users to create, read, update, and delete inventory items. It also provides user authentication and authorization.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)

[//]: # (- [License]&#40;#license&#41;)

[//]: # (- [Contact]&#40;#contact&#41;)

## Features

- User authentication and authorization
- CRUD operations for inventory items
- Error handling and validation

## Tech Stack

This project is built with:

- Node.js
- Express.js
- PostgreSQL

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- PostgreSQL

### Installation

1. Unzip the package
```bash
$ unzip inventory-management-api.zip
```

2. Change into the directory
```bash
$ cd inventory-management-api
```
3. Install dependencies
```bash
$ npm install 
```

4. Create a `.env` file in the root directory and add the following environment variables.
NOTE: you can also check the .env.example file for reference
```env
ENVIRONMENT='development'
PORT=8080

# DB
HOST='host'
DB_PORT=5432
DB_USER='user'
DB_USER_PASSWORD='user password'
DB='db_name'

# AUTH SECRETS
## jwt
JWT_SECRET_ACCESS_TOKEN='secret'
JWT_SECRET_REFRESH_TOKEN='secret'

# MAIL SERVICE
EMAIL_SENDER='email@gmail.com'
EMAIL_PASSWORD='password'

```

5. Run the application
```bash
$ npm start
```

## API Endpoints Summary
The API has the following endpoints:

### Authentication
- POST /api/v1/auth/register: Create a new user
- POST /api/v1/auth/login: Login a user
- POST /api/v1/auth/logout: Logout a user
- POST /api/v1/auth/refresh-token: Refresh access token
- POST /api/v1/auth/forgot-password: Send reset password link
- POST /api/v1/auth/reset-password: Reset user password

### User Management
- GET /api/v1/u/profile/all: Get all users
- GET /api/v1/u/profile: Get my profile (user must be logged in)
- PUT /api/v1/u/profile: Update logged in user
- DELETE /api/v1/users/:id: Delete a user

### Product Management
Keywords: `sku` - Stock Keeping Unit

- POST /api/v1/products/add  : Create a product
- GET /api/v1/products       : Get all products
- GET /api/v1/products/:sku  : Get a product
- PUT /api/v1/products/:sku   : Update a product
- DELETE /api/v1/products/:sku: Delete a product

- GET /api/v1/products/sell/:barcode?units=:units  :  Sell a product
- GET /api/v1/products/level/lowStock :  Get low stock products
- GET /api/v1/products/level/outOfStock :  Get out of stock products
- POST /products/re-order/:sku: Re-order a product
- GET /api/v1/products/value/:sku : Get the value of a product
- GET /api/v1/products/value/all : Get the value of all products

## API Endpoints Details
### Authentication
#### Create User

- **Description**: Register a new user.
- **HTTP Method**: POST
- **Route**: `/api/v1/auth/register`

- **_example_**
- **Request Body**:

  ```json
  {
    "username": "newUser",
    "email": "newuser@example.com",
    "password": "password#123"
  }

- **Sample of Successful Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
        "userName": "gabbu",
        "email": "gatimu652@gmail.com",
        "role": "admin"
    }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Error: This EMAIL is already in use. Use another email",
    }

#### Login User

- **Description**: Login an existing user.
- **HTTP Method**: POST
- **Route**: `/api/v1/auth/login`

- **_example_**
- **Request Body**:

  ```json
  {
    "email": "existinguser@example.com",
    "password": "password123"
  }

- **Sample of Successful Response**:
  ```json
  {
    "user": {
        "userName": "existingUser",
        "email": "existinguser@example.com",
        "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Invalid email or password",
  }

#### Logout User

- **Description**: Logout a user.
- **HTTP Method**: POST
- **Route**: `/api/v1/auth/logout`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "message": "Logged Out"
  }

#### Refresh Access Token

- **Description**: Refresh the user's access token.
- **HTTP Method**: POST
- **Route**: `/api/v1/auth/refresh`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "user": {
        "userName": "existingUser",
        "userId": "123",
        "email": "existinguser@example.com",
        "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Unknown User",
  }
  
#### Forgot Password

- **Description**: Request a password reset link.
- **HTTP Method**: POST
- **Route**: `/api/v1/auth/forgot-password`

- **_example_**
- **Request Body**:

  ```json
  {
    "email": "existinguser@example.com"
  }

- **Sample of Successful Response**:
  ```json
  {
    "passwordResetMessage": "A password reset email has been sent to your inbox. Check your email to reset your password"
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "User not found",
  }

#### Reset Password

- **Description**: Reset the user's password using the reset token.
- **HTTP Method**: PUT
- **Route**: `/api/v1/auth/reset-password/:resetToken`

- **_example_**
- **Request Body**:

  ```json
  {
    "password": "newPassword123",
    "confirmPassword": "newPassword123"
  }

- **Sample of Successful Response**:
  ```json
  {
    "message": "Your password has been reset"
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Passwords do not match",
  }

### User Management
### Get User Profile

- **Description**: Get the profile of the logged-in user.
- **HTTP Method**: POST
- **Route**: `/api/v1/u/profile`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "userName": "existingUser",
    "email": "existinguser@example.com",
    "role": "admin"
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "User not found",
  }

### Update User Profile

- **Description**: Update the profile of the logged-in user.
- **HTTP Method**: PUT
- **Route**: `/api/v1/u/profile`

- **_example_**
- **Request Body**:

  ```json
  {
    "userName": "newUserName",
    "email": "newemail@example.com",
    "password": "newPassword123"
  }

- **Sample of Successful Response**:
  ```json
  {
    "success": true,
    "message": "Profile Updated Successfully",
    "user": {
        "userName": "newUserName",
        "email": "newemail@example.com",
        "role": "admin"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "User not found",
  }

### Delete User Profile

- **Description**: Delete the profile of the logged-in user.
- **HTTP Method**: DELETE
- **Route**: `/api/v1/u/profile`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "message": "Profile deleted successfully"
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Failed to delete user profile",
  }

### Get All User Profiles

- **Description**: Get the profiles of all users (admin only).
- **HTTP Method**: GET
- **Route**: `/api/v1/u/profile/all`

- **_example_**

- **Sample of Successful Response**:
  ```json
  [
    {
      "userName": "user1",
      "email": "user1@example.com",
      "role": "admin"
    },
    {
      "userName": "user2",
      "email": "user2@example.com",
      "role": "user"
    }
  ]

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Error occurred when fetching users",
  }


### Create a new product

- **Description**: Add a new product to the store.
- **HTTP Method**: POST
- **Route**: `/base_api/products`

- **_example_**
- **Request Body**:

  ```json
  {
    "sku": "123456",
    "barcode": "789012",
    "productCode": "345678",
    "productName": "Product Name",
    "productDescription": "Product Description",
    "productCategory": "Product Category",
    "reOrderPoint": 10,
    "maximumStock": 100,
    "pricePerUnit": 9.99
  }

- **Sample of Successful Response**:
  ```json
  {
    "message": "Successfully added product to store",
    "productDetails": {
        "id": 1,
        "sku": "123456",
        "barcode": "789012",
        "productName": "Product Name",
        "productDescription": "Product Description",
        "productCategory": "Product Category",
        "reOrderPoint": 10,
        "maximumStock": 100,
        "pricePerUnit": 9.99,
        "inStock": 100
    }
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product already exists in store",
  }

### Get a product by SKU

- **Description**: Retrieve a product from the store by SKU.
- **HTTP Method**: GET
- **Route**: `/base_api/products/:sku`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "product": {
        "id": 1,
        "sku": "123456",
        "barcode": "789012",
        "productName": "Product Name",
        "productDescription": "Product Description",
        "productCategory": "Product Category",
        "reOrderPoint": 10,
        "maximumStock": 100,
        "pricePerUnit": 9.99,
        "inStock": 100
    }
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product not found",
  }

### Get all products

- **Description**: Retrieve all products from the store.
- **HTTP Method**: GET
- **Route**: `/base_api/products`

- **_example_**

- **Sample of Successful Response**:
  ```json
  [
    {
        "id": 1,
        "sku": "123456",
        "barcode": "789012",
        "productName": "Product Name",
        "productDescription": "Product Description",
        "productCategory": "Product Category",
        "reOrderPoint": 10,
        "maximumStock": 100,
        "pricePerUnit": 9.99,
        "inStock": 100
    },
    [...]
  ]

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "No products found",
  }

### Update a product

- **Description**: Update a product in the store.
- **HTTP Method**: PUT
- **Route**: `/base_api/products/:sku`

- **_example_**
- **Request Body**:

  ```json
  {
    "newSku": "654321",
    "barcode": "210987",
    "productName": "Updated Product Name",
    "productDescription": "Updated Product Description",
    "productCategory": "Updated Product Category",
    "reOrderPoint": 20,
    "maximumStock": 200,
    "pricePerUnit": 19.99
  }

- **Sample of Successful Response**:
  ```json
  {
    "message": "Product updated successfully",
    "product": {
        "id": 1,
        "sku": "654321",
        "barcode": "210987",
        "productName": "Updated Product Name",
        "productDescription": "Updated Product Description",
        "productCategory": "Updated Product Category",
        "reOrderPoint": 20,
        "maximumStock": 200,
        "pricePerUnit": 19.99,
        "inStock": 200
    }
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product not found",
  }

### Delete a product

- **Description**: Remove a product from the store.
- **HTTP Method**: DELETE
- **Route**: `/base_api/products/:sku`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "message": "Product deleted successfully"
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product not found",
  }

### Sell a product

- **Description**: Sell a product from the store.
- **HTTP Method**: GET
- **Route**: `/base_api/products/sell/:barcode`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "message": "Product purchased successfully",
    "remainingUnits": 99
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product barcode not found",
  }

### Get all products with low stock

- **Description**: Retrieve all products from the store with low stock.
- **HTTP Method**: GET
- **Route**: `/base_api/products/level/lowstock`

- **_example_**

- **Sample of Successful Response**:
  ```json
  [
    {
        "id": 1,
        "sku": "123456",
        "barcode": "789012",
        "productName": "Product Name",
        "productDescription": "Product Description",
        "productCategory": "Product Category",
        "reOrderPoint": 10,
        "maximumStock": 100,
        "pricePerUnit": 9.99,
        "inStock": 9
    },
    [...]
  ]

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "No products with low stock",
  }

### Get out of stock products

- **Description**: Retrieve all products from the store that are out of stock.
- **HTTP Method**: GET
- **Route**: `/base_api/products/level/outOfStock`

- **_example_**

- **Sample of Successful Response**:
  ```json
  [
    {
        "id": 1,
        "sku": "123456",
        "barcode": "789012",
        "productName": "Product Name",
        "productDescription": "Product Description",
        "productCategory": "Product Category",
        "reOrderPoint": 10,
        "maximumStock": 100,
        "pricePerUnit": 9.99,
        "inStock": 0
    },
    [...]
  ]

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "No out of stock products",
  }

### Get a product's value

- **Description**: Retrieve the value of a product in the store.
- **HTTP Method**: GET
- **Route**: `/base_api/products/value/product/:sku`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "productName": "Product Name",
    "units": 100,
    "pricePerUnit": 9.99,
    "value": 999.00
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product not found",
  }

### Get all products value

- **Description**: Retrieve the total value of all products in the store.
- **HTTP Method**: GET
- **Route**: `/base_api/products/value`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "totalProductsInStock": 100,
    "totalValue": 99900.00
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "No products found",
  }

### Re-order product

- **Description**: Re-order a product in the store.
- **HTTP Method**: POST
- **Route**: `/base_api/products/reorder/:sku`

- **_example_**

- **Sample of Successful Response**:
  ```json
  {
    "message": "Product re-ordered successfully",
    "product": {
        "sku": "123456",
        "productName": "Product Name",
        "inStock": 100,
        "maximumStock": 100
    }
  }

- **Sample of Error Response**:
  ```json
  {
    "success": false,
    "message": "Product not found",
  }

## Testing
You can import the Postman Collection from the [Postman Collection](./Inventory Collection.postman_collection.json) file located in the root directory of this project to test the API endpoints.

