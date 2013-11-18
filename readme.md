Node API Todo App
This is a toy app that creates a Node API server for a Todos app. It uses `Express` for server, `MongoDB` for db, `ElasticSearch` for searching, `Twilio/Mashape` for SMS, and `Mocha` for testing.

TODOS:
- Implement a front-end UI
- Refactor twilio SMS code
- Update/Remove ElasticSearch index for PUT and DELETE operations.
- Add `nock` or `replay` for testing
- Add RESTful operations for the List resource

TO RUN:
===========

- Create `keys.json` (it's in `.gitignore`)
- Run MongoDb: `mongod`
- If you already have data, make sure to first index the database
`./bin/index_all_data`
  - This will index your mongo database via the `searchly` API.
- Start server: `node server.js`
