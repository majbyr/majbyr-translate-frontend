FROM node:alpine:latest
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM openshift:alpine:latest
COPY --from=0 /app/build /usr/share/nginx/html