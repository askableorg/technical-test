## Setup
Install packages via npm. It requires npm 14.x:
```
npm install
```

To start server:
```
npm start
```

To run tests:
```
npm test
```

## API Stucture

### GET /products
*params*:
```
limit = number
sort = created-asc | created-desc | price-asc | price-desc
```

*response*:
```(json)
[
  {
    "_id": "576bc376b5a3c41dbf1e3a68",
    "title": "Rustic Concrete Fish",
    "order_id": null,
    "created_at": "2022-09-13T04:30:32.384Z",
    "category": "Hats",
    "price": "193.00"
  }
  ...
]
```

### PUT /products
*params (all required)*:
```
title : string
price : string
category : 'Sneakers' | 'Clothing' | 'Watches' | 'Hats'
```

*response*:
```
{
  "_id": "576bc376b5a3c41dbf1e3a68",
  "title": "Rustic Concrete Fish",
  "order_id": null,
  "created_at": "2022-09-13T04:30:32.384Z",
  "category": "Hats",
  "price": "193.00"
}
```

*possible errors*:
```
status: 406
{ error: "Incorrect VALUE for ATTRIBUTE :title" }
{ error: "Incorrect VALUE for ATTRIBUTE :price" }
{ error: "Incorrect VALUE for ATTRIBUTE :category" }
```

### GET /products/:_id
*response*:
```
{
  "_id": "576bc376b5a3c41dbf1e3a68",
  "title": "Rustic Concrete Fish",
  "order_id": "09caccce84a7eeebb8fe4e4f",
  "created_at": "2022-09-13T04:30:32.384Z",
  "category": "Hats",
  "price": "193.00"
}
```

*possible errors*:
```
status: 404
{ error: "Can not FIND the PRODUCT with _ID <ID>" }
```

### GET /products/orders/:_id
*response*:
```
{
  "_id": "576bc376b5a3c41dbf1e3a68",
  "title": "Rustic Concrete Fish",
  "order_id": "09caccce84a7eeebb8fe4e4f",
  "created_at": "2022-09-13T04:30:32.384Z",
  "category": "Hats",
  "price": "193.00"
}
```

*possible errors*:
```
status: 404
{ error: "Can not FIND the ORDER with _ID <ID>" }
status: 404
{ error: "Can not FIND the PRODUCT with _ID <ID>" }
```

### DELETE /products/:_id
*response*:
```
{
  "deleted" : true,
  "product" : {
    "_id": "576bc376b5a3c41dbf1e3a68",
    "title": "Rustic Concrete Fish",
    "order_id": "09caccce84a7eeebb8fe4e4f",
    "created_at": "2022-09-13T04:30:32.384Z",
    "category": "Hats",
    "price": "193.00"
  },
  "order" : {
    "_id": "09caccce84a7eeebb8fe4e4f",
    "product_id" : "576bc376b5a3c41dbf1e3a68"
  }
}
```

*possible errors*:
```
status: 404
{ error: "Can not FIND the PRODUCT with _ID <ID>" }
```

### POST /orders
*params*:
```
product_id = string
```

*response*:
{
  "_id": "09caccce84a7eeebb8fe4e4f",
  "product_id": "576bc376b5a3c41dbf1e3a68",
}

*possible errors*:
```
status: 404
{ error: "Can not FIND the PRODUCT with _ID <ID>" }
```

### GET /orders/:_id
*response*:
{
  "_id": "09caccce84a7eeebb8fe4e4f",
  "product_id": "576bc376b5a3c41dbf1e3a68",
}

*possible errors*:
```
status: 404
{ error: "Can not FIND the ORDER with _ID <ID>" }
```

### Scenario:

Build a backend API for an online marketplace application. The API will be used to mange Product listings, and Order transactions. You will need to design and implement the following endpoints:

1. Create a new Product.
1. Retrieve a single Product based on `_id`.
1. Retrieve a single Product based on the Order.
1. Ability to retrieve X amount of Products that can be sorted either by created date or price.
1. Create a new Order.
1. Retrieve a single Order based on `_id`.
1. Delete a Product (For testing purposes, deleting a Product should also delete the Order associated with it, if it exists)

**Products should be a One-to-One relationship with Orders.**

#### Notes:

1. If I try purchase a Product that has already been sold, the endpoint should return an error.
1. Use the mocked memory database in `./data/Database` to manage all data
1. Implement input validation for all endpoints
1. Implement error handling for all endpoints
1. Write tests for all endpoints (optional)

#### Instructions:

Fork this repository and create a new branch with your name
Complete the test and push your code to your branch
Include a README file with instructions on how to run your applications and tests
Create a pull request and include any relevant information in the description

Let Ash know once it's complete
