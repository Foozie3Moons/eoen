# Eoen Loan Calculation

Eoen is a pet project of mine. There's a lot of mortgage calculators out there but there's not a lot of free ones that calculate the true cost of a mortgage. So the intention of Eoen is to provide a quality service for visualizing mortgage data. In its current state, it's just a simple fixed rate loan calculator but the intention is to expand the functionality to meet our vision of what this app is supposed to be.

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
- [ ] Incorporate at least one API. Examples include Yelp, Tumblr, Facebook, and others on Mashape.
  - Using Quandl API (see below)
  - **Status**: On Hold
    - Having troubles sending API data from front-end to static javascript files, probably need to move d3 viz to the back-end
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
  - Available at https://eoen.herokuapp.com

## Routes

  | Verb | URL | Purpose | Status |
  |---|---|---|---|
  | GET | / | Enticing home page | Operational |
  | GET | /auth/login | Login page / modal | Operational |
  | GET | /auth/signup | Signup page / modal | Operational |
  | POST | /auth/login | Posts login information | Operational |
  | POST | /auth/signup | Posts signup information | Operational |
  | GET | /profile | Gets renders user's loans via redirect to /profile/loans |  Operational |
  | GET | /profile/account | Shows user account settings | Hold |
  | GET | /profile/account | Displays user's account information | Hold |
  | GET | /profile/account/edit | Edit page for account settings | Hold |
  | PUT | /profile/account | Updates user account information and redirects to `/profile/account` | Hold |
  | DELETE | /profile/account | Deletes the user's account forever and redirects to `/` | Hold |
  | GET | /profile/loans | Display basic link information for all loans including a small description of that loan, like tags (personal, mortgage, etc) | Operational |
  | GET | /profile/loans/:loanId | Display advanced information for all loans including a small description of that loan, like tags (personal, mortgage, etc) as well as the various visualizations the user can have | Operational |
  | POST | /profile/loans | Posts loan information to server, creating a loan in the database and redirects to the created loan instance /profile/loans/:loanId | Operational |
  | PUT | /profile/loans/:loanId | Updates existing mortgage details and redirects to the same /profile/loans/:loanId | Operational |
  | DELETE | /profile/loans/:loanId | Deletes the loan from the database and redirects to /profile/loans | Operational |

## API

**Status:** On Hold

Consuming an api through Quandl, a premier data provider for almost everything. The API requests data from Quandl on Freddy Mac's 30 year mortgage interest rates, dating back through 1970.

Website[https://www.quandil.com]

## D3 charts

**Please Note**:
Charts are intended to be scalable but are currently not. The scaling for full screen makes them too big (overflowing the container), while mobile makes them too tiny. This is an issue that is on the front burner for fixing.

## Technologies Used

- Node.js
- Express
- Request
- D3.js
- Sequelize/PostgreSQL
- Semantic UI
- Passport

## Additional Features

- All loans instead of just mortgages
  - This was realized before creating a 'mortgage' model, so the existing model should make for an easy transition.
- Both fixed rate and adjustable rate loans/mortgages (currently only fixed rate applies)
- Additional mortgage details:
  - HOA Fees
  - Private Mortgage Insurance (FHA)
  - Homeowners insurance
  - Property tax
  - Tax savings - Mortgage Interest
    - Static Values
      - Federal Marginal Tax Rate (need current federal tax data)
      - State Marginal Tax Rate (need current state tax data)
    - Calculated Values
      - Amortized tax savings
      - Monthly tax savings
      - Yearly tax savings
  - Tax savings - Property Tax
  - Total Payments
  - Mortgage Ratios
    - Static values
      - Responsible party's income
      - Any additional responsible party's income
      - Lender Front-End
      - Lender Back-End
    - Calculated values
      - Mortgage Amount
      - Mortgage, Taxn Insurance
      - Monthly Debts
      - Front-End
      - Back-End
- Lender comparisons
  - 30 fixed
  - 10/1 ARM
  - 7/1 ARM
  - Closing Costs
  - Lender Credit
- Expanded payment schedule options
- Down Payment visualization
  - Static Values
    - Expected Down Payment Amount
  - Calculated Values
    - Finding a loan amount that fits your expected down payment
    - Home Amount / Expected Down Payment Amount = percent
  - Need more consulting on the usefulness of this Features

## Optimizations

- Extract the front-end javascript data manipulation to the back-end
- Make charts more plug-and-play. Currently very specific uses.
  - Need to redesign the data input creation from form fields as well as accessing that data in the d3 functions themselves.
