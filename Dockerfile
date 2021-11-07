FROM node:16.13.0-alpine

COPY . /spg
WORKDIR /spg
RUN npm run build

ENTRYPOINT [ "npm start" ]