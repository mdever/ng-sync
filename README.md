# NgSync

This is a POC for a PouchDB/CouchDB backed Store for in an ngrx application  

To run CouchDB locally, build the docker image defined in the Dockerfile.  
`docker build . -t local-couchdb`  

Run with  
`docker run -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password -p 5984:5984 local-couchdb`  

The docker image is not fully configured and you'll need to manually curl some commands in. Once its running, in a separate terminal run  
`curl -X PUT http://admin:password@localhost:5984/_users`  
`curl -X PUT http://admin:password@localhost:5984/_replicators`  
`curl -X PUT http://admin:password@localhost:5984/_global_changes`  

Obviously some things are not complete. Most glaringly, the connections to CouchDB are using Basic authentication with the username/password hardcoded in to the SPA.  In reality, this would probably be done through a proxy server.  

I have no idea the scalability with something like this. It creates a new database per session. However that is a typical approach with a tool like CouchDB so maybe its doable.