# Eoen Mortgage Solutions

The intention of Eoen is to provide a quality service for visualizing mortgage data. Eventually this will be broadened to be all loan data, not just mortgage data.

The MVP of the project is to have a fully functional D3 visualization demo that users can use to simulate the basic functionality of a mortgage. When the user signs up for an account, they will be able to save, update, and delete their mortgage details.

## Getting Started

#### Scaffold w/tests (see `master` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Change the database names in `config/config.json` to reflect your project
  * Run `createdb eoen_development` to create the development database
  * Run `createdb eoen_test` to create the test database

#### Finished version (see `brian-finished` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Run `createdb eoen_development` to create the development database
  * Run `createdb eoen_test` to create the test database
  * Run `sequelize db:migrate` to run migrations

## Technical Requirements For Project

- [x] Have at least 2 models (more if they make sense) -- ideally a user model and one that represents the main functional idea for your app
Include sign up/log in functionality, with hashed passwords & an authorization flow
  - User model with authentication using passport
  - Loan model for storig users loan details and displaying charts to visualize their loan
- [x]Incorporate at least one API. Examples include Yelp, Tumblr, Facebook, and others on Mashape.
  - Using Quandl API (see below)
- [x] Have complete RESTful routes for at least one of your resources with GET, POST, PUT, and DELETE
  - See complete routing list below
- [x] Utilize an ORM to create a database table structure and interact with your relationally-stored data
  - Using Sequelize to connect back-end data to the database
- [x] Include wireframes that you designed during the planning process
  - Main wireframe below
- [x] Have semantically clean HTML and CSS
  - Templating engine using Pug makes for clean and readable HTML
  - CSS organized by functional component (which framework the css is targeting)
- [x] Be deployed online and accessible to the public
  - Available at https://eoen.heroku.com

## Routes

  | Verb | URL | Purpose | Description
  |---|---|---|---|
  | GET | / | Home Page | Overview of website / standard home page |
  | GET | /auth/login | Login Page | Login page / modal |
  | GET | /auth/signup | Signup Page | Form where users can enter data to sign up for the service |
  | POST | /auth/login | Posts login information | |
  | POST | /auth/signup | Posts signup information | |
  | GET | /users/:id | Gets user home page | User's dashboard |
  | GET | /users/:id/account | Shows user account settings | Contains how to update their user information |
  | GET | /users/:id/account/ | Edit page for account settings | Contains a form to edit/update user information |
  | PUT | /users/:id/account | Updates user information from the edit/update form | |
  | DELETE | /users/:id/account | Deletes the user's account forever | Purpose explains it pretty well |
  | GET | /users/:id/mortgage | Get mortgage information form | Form for editing |
  | POST | /users/:id/mortgage | Posts mortgage information for | |
  | PUT | /users/:id/mortgage | Updates existing mortgage details | |
  | DELETE | /users/:id/mortgage | Deletes the user's mortgage | |

## API

Consuming an api through Quandl, a premier data provider for almost everything. The API requests data from Quandl on Freddy Mac's 30 year mortgage interest rates, dating back through 1970.

Website[https://www.quandil.com]

## Technologies Used

- Node.js
- Express
- Request
- D3.js
- Sequelize/PostgreSQL
- Semantic UI
- Passport
