FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV API_PORT=8080

EXPOSE 8080

RUN npm run build

CMD ["npm", "run", "start"]