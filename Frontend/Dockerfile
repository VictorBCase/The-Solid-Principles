# Building React page:

FROM node:20-alpine AS build

WORKDIR /app/IMS-app

COPY IMS-app/package*.json ./

RUN npm install

COPY IMS-app/ .

RUN npm run build


# Build Proxy: 
FROM node:20-alpine

WORKDIR /app/Proxy

COPY Proxy/package*.json ./

RUN npm install

COPY Proxy/ .

COPY --from=build /app/IMS-app/build /app/Proxy/frontend-build

EXPOSE 5000

CMD ["node", "rpc-proxy.js"]