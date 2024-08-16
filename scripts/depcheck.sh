echo "depcheck root"
depcheck

(cd packages/back-end && yarn depcheck)

echo "\ndepcheck front-end"
(cd packages/front-end && yarn depcheck)
