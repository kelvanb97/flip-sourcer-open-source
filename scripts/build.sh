(cd packages/back-end && yarn build)

echo "\nbuild front-end"
(cd packages/front-end && yarn build:fe)

echo "\nbuild cdk"
(cd packages/cdk && yarn build)
