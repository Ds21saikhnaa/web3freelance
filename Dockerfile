# staged building
FROM alpine as builder
RUN apk add --update nodejs npm

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build && npm prune --production

FROM alpine as runner
RUN apk add --update nodejs

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules

CMD [ "node", "dist/main.js" ]