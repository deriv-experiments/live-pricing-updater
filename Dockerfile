FROM node:20

WORKDIR /app

ADD . .

RUN npm install

CMD ["node", "index.js"]
