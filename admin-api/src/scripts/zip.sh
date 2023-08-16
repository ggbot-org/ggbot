#!/usr/bin/env bash

# Cleanup previous .zip files

rm -rf dist/*/index.zip

# Install external deps.

### TODO generate temp/package.json file reading from other package.json
#        files, use a node script
echo '{ "name": "lambda", "type": "module", "dependencies": { "@aws-sdk/client-ec2": "3.379.1", "@aws-sdk/client-iam": "3.379.1", "@aws-sdk/client-s3": "3.379.1", "@aws-sdk/client-ses": "3.379.1", "jsonwebtoken": "9.0.1", "dflow": "0.42.0", "flow-view": "6.0.1" } }' > temp/package.json
cd temp
npm install
cd -

# Copy internal deps.

for INTERNAL_DEP in api api-gateway arithmetic authentication aws binance binance-client database dflow env email-messages http infrastructure locators models test-data time type-utils; do
	mkdir -p temp/node_modules/@ggbot2/$INTERNAL_DEP/dist
	cp -R ../$INTERNAL_DEP/dist/* temp/node_modules/@ggbot2/$INTERNAL_DEP/dist/
	cp ../$INTERNAL_DEP/package.json temp/node_modules/@ggbot2/$INTERNAL_DEP/
done

# Zip lambdas.

for LAMBDA in action; do
	mkdir -p dist/$LAMBDA/node_modules
	cp temp/${LAMBDA}.js dist/$LAMBDA/index.js
	cp temp/package.json dist/$LAMBDA/
	cp -R temp/node_modules/* dist/$LAMBDA/node_modules/
	cd dist/$LAMBDA
	zip -X -r ../${LAMBDA}.zip * > /dev/null
	cd -
done
