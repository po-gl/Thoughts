FROM node:20-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=build /app/dist /srv/www/html

COPY nginx.conf /etc/nginx/nginx.conf
COPY proxy.conf /etc/nginx/proxy.conf
COPY mime.types /etc/nginx/mime.types

RUN mkdir /etc/nginx/logs && touch /etc/nginx/logs/error.log

EXPOSE 80

