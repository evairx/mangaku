FROM node:20

RUN mkdir -p /usr/src/mangaku-app

WORKDIR /usr/src/mangaku-app

COPY . .

RUN npm install

CMD [ "npm", "dev" ]