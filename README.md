# Book Overview
![book](https://github.com/user-attachments/assets/18140ade-e78f-4ee9-a5cc-fbe1574a08d8)

## Features
This application helps users keep track of what one is reading or have previously read. Users are able to create an account and find available books from Google Books API to display on their user profile. 

## Technologies
Back-end uses NodeJS with Express and Mongoose + a MongoDB database. Front-end is written in TypeScript with the Vue framework. Pinia is used for session utility.

## Setup
You can use a MongoDB database. Make sure it contains a collection called "users". You should also add an access token for JWT (JSON Web Token) generation.

Create .env file in back-end and add:
- DATABASE_URL=insert_your_database_url
- ACCESS_TOKEN_SECRET=insert_your_access_token

Run the following command to install requirements:
- npm install

Back-end can be started with:
- npm run start

Front-end can be started with:
- npm run dev

## License
MIT License
