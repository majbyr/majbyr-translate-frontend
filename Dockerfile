FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
FROM bitnami/nginx:latest
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]