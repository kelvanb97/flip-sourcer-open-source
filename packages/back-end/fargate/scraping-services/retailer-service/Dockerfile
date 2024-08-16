FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY dist ./dist

COPY package.json yarn.lock ./

RUN yarn install --production

CMD [ "node", "dist/fargate/scraping-services/retailer-service/src/index.js" ]