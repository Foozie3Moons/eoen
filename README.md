# Express Authentication

Express authentication template using Passport + flash messages + custom middleware

## Getting Started

#### Scaffold w/tests (see `master` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Change the database names in `config/config.json` to reflect your project
  * Run `createdb project_name_development` to create the development database
  * Run `createdb project_name_test` to create the test database

#### Finished version (see `brian-finished` branch)

* Run `npm install` to install dependencies
  * Use `npm run lint:js` to lint your JS
  * Use `npm run lint:css` to lint your CSS
  * Use `npm test` to run tests
* Setup the databases
  * Run `createdb express_auth_development` to create the development database
  * Run `createdb express_auth_test` to create the test database
  * Run `sequelize db:migrate` to run migrations

## Routes

  | Verb | URL | Purpose | Description
  |---|---|---|---|
  | GET | / | Home Page | Overview of website / standard home page |
  | GET | /login | Login Page | Login page / modal |
  | GET | /signup | Signup Page | Form where users can enter data to sign up for the service |
  | POST | /login | Posts login information | |
  | POST | /signup | Posts signup information | |
  | GET | /:user | Gets user home page | User's dashboard |
  | GET | /:user/account | Shows user account settings | Contains how to update their user information |
  | GET | /:user/account/edit | Edit page for account settings | Contains a form to edit/update user information |
  | POST | /:user/account | Updates user information from the edit/update form | |
  | DELETE | /:user/account | Deletes the user's account forever | Purpose explains it pretty well |
  | GET | /:user/morgage | Get morgage information form | Form for editing |
  | POST | /:user/morgage | Posts morgage information for | |
