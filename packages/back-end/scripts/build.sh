echo "\nbuild back-end"
rm -rf node_modules && yarn && rm -rf ./dist && tsc

echo "\nbuild api-service"
(cd fargate/api-service && yarn build)

echo "\nbuild keepa-service"
(cd fargate/keepa-service && yarn build)

echo "\nbuild gpt-product-title-matcher-service"
(cd fargate/gpt-product-title-matcher-service && yarn build)

echo "\nbuild retailer-service"
(cd fargate/scraping-services/retailer-service && yarn build)

echo "\nbuild amazon-service"
(cd fargate/scraping-services/amazon-service && yarn build)

echo "\nbuild product-matcher-service"
(cd lambda/product-matcher-service && yarn build)

echo "\nbuild scraper-chron-service"
(cd lambda/scraper-chron-service && yarn build)
