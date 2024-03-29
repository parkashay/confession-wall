## ConfessionWall - Backend

### Introduction

A simple web server built with NestJS, leveraging GraphQL for API interactions and implementing JWT-based authentication for user authentication and authorization.

### Features

- Users can post confessions.
- CRUD operations for managing confessions.
- JWT-based authentication for secure user authentication.

### Prerequisites

- Node.js installed on your machine.
- npm or yarn package manager installed.
- any relational database

### Installation

    - Clone the repository:
        `git clone <repository_url>`

    - Install dependencies:
        `yarn install or npm install`

    - Set up environment variables:
        Rename .env.example file to .env.
        Update .env file with your database.

    - Start the application:
        npm start or npm run dev for development

### Usage

    - Access the GraphQL playground at http://localhost:3001/graphql to interact with the API.
    - To perform operations requiring authentication, provide the JWT token as a Bearer token via the Authorization header.

### Queries

    - currentUser: returns the current logged in user
    - getAllConfessions: returns all the confessions in the database //TODO: pagination
    - getUserConfessions: returns the confessions posted by the logged in user

### Mutations

    - registerWithCredentials(input: {fullname: "", email:"", password: ""}) : registers a new user and returns jwt token via Set-Cookie header which needs to be included as a Bearer token in Authorization header for future requests
    - loginWithCredentials(input: {email: "", password: ""}) : logs in a user and returns the Set-Cookie header with jwt token
    - loginWithGoogle(token: ""): takes the google access token as a parameter and logs in or registers a new user
    - createConfession(ConfessionInput!): creates a new confession (requires authentication)
    - deleteConfession(id: ID): deletes a confession(requires authentication)
