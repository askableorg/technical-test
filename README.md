# Askable Technical Test

Welcome to Askable Technical Test 🚀 This test is consisted of two parts

1. Build a minimal online marketplace application
2. Improve interactive performance of users list view

## Technical notes

- Frontend app `/apps/frontend` (`http://localhost:5173`)
- Rest server `/apps/server` (`http://localhost:3000`)
- Run both apps from the root `pnpm run dev`

## 1. Build a minimal online marketplace application

### Scenario:

Build a minimal app for an online marketplace application. The app will be used to manage Product listings, and Order transactions. The app should implement the following functionality:

1. Create a new Product.
1. View a single products details.
1. View a single products order details (if it exits).
1. View X amount of products that are sortable by either created date or price
1. Ability to purchase the product
1. Delete a Product (For testing purposes, deleting a Product should also delete the Order associated with it, if it exists)

**You can come up with any frontend design you like**
**You will need to implement both the server and the frontend**
**No authentication is required**
**Products should be a One-to-One relationship with Orders.**

#### Notes:

1. Use any library/tooling that you would like. (React Router, Redux, ChakraUI etc)
1. If I try purchase a Product that has already been sold, the endpoint should return an error.
1. Use the mocked database in `./data/Database` to manage all data
1. Implement input validation for all endpoints
1. Implement error handling for all endpoints
1. Write tests for critical paths
1. Implement under `/products` route

## 2. Improve interaction performance of users list view

Please visit `http://localhost:5173/users`.

We have a web page which displays our users data as a list. User can click an item in a list and it displays popover with extra information. However, currently it takes some time to open a popover. We want you to improve this performance!

This page has to

1. Open a popover faster and smoother
2. User names are displayed in a list and extra information is only accessible through popover
3. Animation of popover cannot be removed

#### Instructions:

Clone this repository and create a new branch with your name
Complete the test and push your code to your branch
Add a description in your PR with instructions on how to run your applications and any tests
Create a pull request and include any relevant information in the description

Let Askable know once it's complete
