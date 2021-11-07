# solidarity-purchasing-group-P09

An app that allow clients to make group orders for great products, made by farmers with love

The docker image can be build running in the root of the project:
`docker build -t spg:latest .`

It can than be run using:
`docker run --env MONGO_CONN_STR={} --env MONGO_DB_NAME={} -p 80:80 spg:latest`
