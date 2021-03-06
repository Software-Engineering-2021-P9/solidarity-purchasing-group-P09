# solidarity-purchasing-group-P09

An app that allow clients to make group orders for great products, made by farmers with love

## Deploy

The app is deployed on Heroku:

- Test App: https://spg-testing.herokuapp.com
- Production App: https://spg-prod.herokuapp.com

## Developers

The environment variable MONGO_CONN_STR and MONGO_DB_NAME must be set (using export / set command).

The app can be ran in these ways:

- Simulating deploy: execute the commands in the root folder -> `npm run build` -> `npm start` -> the app will run on port 3001.
- Separate apps: start using `npm start` both the client and the server. The client will run on the port 3000 and the server on port 3001.

## Docker

The docker image can be built running in the root of the project:
`docker build -t marcobramini/solidarity-purchasing-group-p09:release-x -t marcobramini/solidarity-purchasing-group-p09:latest .`

And then pushed to DockerHub using:
`docker push marcobramini/solidarity-purchasing-group-p09:latest`

It can than be ran using:
`docker run --env MONGO_CONN_STR={placeholder-cannot-put-this-here} --env MONGO_DB_NAME=spg -p 80:80 marcobramini/solidarity-purchasing-group-p09:latest`
