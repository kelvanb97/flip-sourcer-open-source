FROM public.ecr.aws/lambda/nodejs:18

COPY dist ./dist

COPY package.json yarn.lock ./

RUN npm install --omit=dev

CMD [ "dist/lambda/product-matcher-service/src/index.similarityScoreHandler" ]
