FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY dist ./dist

COPY package.json yarn.lock ./

RUN yarn install --production

EXPOSE 80 443 4200

CMD [ "node", "dist/fargate/api-service/src/server.js" ]