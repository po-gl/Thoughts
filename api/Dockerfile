FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV API_PORT=80

EXPOSE 80

RUN npm run build

CMD ["npm", "run", "start"]
