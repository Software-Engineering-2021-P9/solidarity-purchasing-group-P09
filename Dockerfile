FROM node:16.13.0-alpine

ENV PORT 80
#env vars MONGO_CONN_STR and MONGO_DB_NAME are needed to run this image and must be provided in the run command.

COPY . /spg
WORKDIR /spg
RUN npm run build

EXPOSE 80
ENTRYPOINT [ "npm", "start" ]