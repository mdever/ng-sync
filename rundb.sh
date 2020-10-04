docker run -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -p 5984:5984 session-db

curl -X PUT http://admin:password@localhost:5984/_users
curl -X PUT http://admin:password@localhost:5984/_replicators
curl -X PUT http://admin:password@localhost:5984/_global_changes
