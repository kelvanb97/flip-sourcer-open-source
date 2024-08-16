echo "\ndepcheck back-end"
depcheck

echo "\ndepcheck api-service"
(cd fargate/api-service && yarn depcheck)

echo "\ndepcheck keepa-service"
(cd fargate/keepa-service && yarn depcheck)

echo "\ndepcheck gpt-product-title-matcher-service"
(cd fargate/gpt-product-title-matcher-service && yarn depcheck)

echo "\ndepcheck retailer-service"
(cd fargate/scraping-services/retailer-service && yarn depcheck)

echo "\ndepcheck amazon-service"
(cd fargate/scraping-services/amazon-service && yarn depcheck)

echo "\ndepcheck product-matcher-service"
(cd lambda/product-matcher-service && yarn depcheck)

echo "\ndepcheck scraper-chron-service"
(cd lambda/scraper-chron-service && yarn depcheck)