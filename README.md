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
