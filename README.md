# Zak Saleh NC-News Portfolio Project

## Hosted Server

https://saleh-nc-news.onrender.com

Endpoints:

- GET /api/articles
- GET /api/users
- GET /api/topics
- GET /api/articles/:articles_id
- GET /api/articles/:articles_id/comments
- POST /api/articles/:article_id/comments
- PATCH /api/articles/:article_id
- DELETE /api/comments/:comment_id

## Introduction

Welcome to my NC-News repo! This project was undertaken to apply what I've learnt about backend development to create a RESTful API utilising node.js, Express, SQL & Test Driven Development. Using CRUD operations, it contains various endpoints that when used in collaboration with the front end React project, designs a sort of Reddit clone, that allows users to GET all articles, POST & update (PATCH) comments on those articles, and DELETE comments as they wish.

## Part 1: Clone

## Part 2: Environment Variables

1. After clone: In order to run locally please create the environment variables.

Create three .env files and update them as follows: (PGDATABASE names can be found in the setup.sql file)

- .env.test >>> PGDATABASE=<database_name_here>

- .env.development >>> PGDATABASE=<database_name_here>

- .env.production >>> DATABASE_URL=<database_name_here>

Update these by adding PGDATABASE=<database_name_here>. These can be found in the setup.sql file.

## Part 3: Setup & Seeding

1. To install all relevant dependencies, first run npm install in the terminal. Secondly, npm run setup-dbs & npm run seed to setup and seed the database with the initial data locally in your system.

Please refer to the package.json for all available scripts.

## Testing

Run [npm test] for all testing purposes

## Versions

Project was built using node v18.14.0 and postgresql v8.7.3
