FROM node:alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM bitnami/nginx:latest
COPY --from=builder /app/build /app
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]