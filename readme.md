## Setup
### Get Dependencies
```javascript
$ npm install
```

### Initialize DB
`GET /init1` to populate neo4j database with locations
`GET /init2` to create relationships between locations

## Running Tests
```javascript
$ mocha --reporter spec
```


## Endpoints
`GET /`
`GET /search?from=375dd5879001acbd84a4683dedc36f68&to=375dd5879001acbd84a4683dede5a75e`