FROM node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG REACT_APP_API_URL=""
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:1.29-alpine@sha256:5616878291a2eed594aee8db4dade5878cf7edcb475e59193904b198d9b830de
ENV API_PROXY_TARGET=https://api.majbyr.com
COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
