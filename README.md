# NC News

> **Hosted API: https://back-end-nc-news-pi4w.onrender.com/api**

This is a back-end project I developed during my time on the Northcoders JavaScript bootcamp, which similates an online news forum, structured around topics, articles, users, and comments.  
The API interacts with a PostgreSQL (PSQL) database and provides endpoints that allow client-side users to perform CRUD (Create, Read, Update, Delete) operations.  
The project follows the MVC (Model-View-Controller) architecture and was developed using the TDD (Test Driven Development) approach. Unit and integration tests are implemented to ensure functionality of the utility functions, data seeding, and API endpoints.

## Setup Instructions

### Cloning the Repo

To clone this repo to your local machine, copy the git HTTPS URL and run the following terminal command

> git clone \<URL>

### Installing Dependencies

Once cloned, navigate to the project directory and ensure the required dependencies, _which are all already included in the package.json file_, are installed to your local machine by running the following terminal command:

> npm install

### Configuring Environment Variables

You will need to create two .env files for the development and testing environments:

> .env.test  
> .env.development

These files are necessary to establish a working connection to both the test and development databases.

**Paste the following line into the corresponding file:**

> // in .env.test  
> PGDATABASE=nc_news_test

> // in .env.development  
> PGDATABASE=nc_news

## Verifying Databse Connections

To confirm your databse connections are set up correctly, run the following scripts in your terminal:

> npm run test-seed  
> // this should console.log "Connected to nc_news_test"

> npm run seed-dev  
> // this should console.log "Connected to nc_news"

## Creating & Seeding The Databases

Run the following scripts in your terminal:

> // set up the databases:  
> npm run setup-dbs

> // seed the **test** database:  
> npm run test-seed

> // seed the **dev** database:  
> npm run dev-seed

## Run The Tests

Run the following scripts for the test suites:

> // run all test suites at once:  
> npm run test

> // run each test suite individually:  
> npm run test app  
> npm run test utils  
> npm run test seed

## Additional Information

The minimum requirements for this repo are:

> Node.js 23.5.0  
> Postgres 16.8
