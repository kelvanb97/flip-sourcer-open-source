# back-end

This is home to all of the source code to various cloud resources designed in a way such that each resource manages its own dependencies.


- [back-end](#back-end)
  - [Fargate](#fargate)
    - [api-service](#api-service)
    - [gpt-product-title-matcher-service](#gpt-product-title-matcher-service)
    - [keepa-service](#keepa-service)
    - [scraping-services/amazon-service](#scraping-servicesamazon-service)
    - [scraping-services/retailer-service](#scraping-servicesretailer-service)
  - [lambda](#lambda)
    - [product-matcher-service](#product-matcher-service)
    - [scraper-chron-service](#scraper-chron-service)
  - [prisma](#prisma)
  - [scripts](#scripts)
  - [shared](#shared)

## Fargate

There are 5 different Fargate services that are key to the success of the Flip Sourcer Product. Fargate has a few key advanatages compared to other cloud services. Fargate abstracts much of the Server Management away 

### api-service

This fargate service defines the client-to-server API calls using [`Express.js`](https://expressjs.com/en/5x/api.html)

### gpt-product-title-matcher-service

This fargate service is in charge of going through the database and assigning a score between 0 - 100 for how close the retail product and the amazon product titles are likely to match. The algorithm takes into account `brand`, `quantity`, `size`, `color`, `voltage`, `variant` as part of the prompting algorithm.

### keepa-service

This fargate service is in charge of going through the database and updating relevant empty rows with Keepa data. Keepa data is how we rendered charts and other relevant Amazon statistics.

### scraping-services/amazon-service

This fargate service is in charge of going through the database and comparing product leads with relevant Amazon listings. 

### scraping-services/retailer-service

There is a fair amount of over simplification in general in these READMEs but this Fargate service is the most complex one by far as it had all the scraping code for the different ecommerce platforms.

## lambda

There are 2 different lambdas that are supplimental to the Fargate services. This is due to the fact that we don't want to consume CPU clock time for the Fargate services so we pass off as many jobs as we can to the Lambdas.

### product-matcher-service

This housed the image recognition algorithm used to as part of the product matching algorithm at large. This is how Flip Sourcer matched products from one retailer to another retailer. Although parsing DOM for UPC codes was easier but wasn't 100% reliable.

### scraper-chron-service

This chron service was used to initialize config data stored in a Postgres RDBMS instance. This basically reset all the scrapers every day.

## prisma

Pretty self explanitory at a high level. PostgresSQL migrations management and ORM.

## scripts

Handles, building, linting and testing

## shared

Shared code between Lambda and Fargate primarily