# Readme

This is my repo for an Express router API for the course [jsramverk](https://jsramverk.se/ 'jsramverk.se') at BTH. The API provides endpoints for getting, saving and updating documents in a MongoDB database. 

## Install
To install all modules the project depends on run `npm install`

## Run
To start the server run `npm start`

## Connect to a MongoDB database
This project is setup to use a MongoDB at [MongoDB Atlas](https://www.mongodb.com/atlas/database 'MongoDB Atlas'). Follow the link if you wish to set up a database at Atlas. Replace the dsn link in the projects `db/database.js` with your own link provided by MongoDB Atlas. Place a .env file in the project root and make sure it is in your .gitignore file. You can then put your credentials in the .env file like so:

```
ATLAS_USERNAME="YOUR ATLAS USERNAME"
ATLAS_PASSWORD="YOUR ATLAS PASSWORD"

```

Alternatively you can install a local MongoDB and connect to it.For more information see: [MongoDB](https://www.mongodb.com/ 'MongoDB')

## Routes
The API provides the following routes:

`GET / Get a JSON-response with the message "Hello world"`

`GET /docs Get all documents`

`POST /docs Adds a document to the database`

Parameters:
```
name: document name
html: html content of the document
```

`PUT /docs` Updates a document

Parameters:
```
_id: the documents id
name: document name
html: html content of the document
```
`POST /docs/update Alternative POST-route for updating a document`

Parameters:
```
_id: the documents id
name: document name
html: html content of the document
```