#!/usr/bin/env bash

# Cleanup previous .zip files

rm -rf dist/*/index.zip

# Install external deps.

echo '{ "name": "lambda", "type": "module", "dependencies": { "@utrustdev/utrust-ts-library": "1.0.4", "@aws-sdk/client-ec2": "3.427.0", "@aws-sdk/client-iam": "3.427.0", "@aws-sdk/client-s3": "3.427.0", "@aws-sdk/client-ses": "3.427.0", "dflow": "0.42.0", "flow-view": "6.0.1", "jsonwebtoken": "9.0.1", "minimal-time-helpers": "0.1.0", "minimal-type-guard-helpers": "0.1.1" } }' > temp/package.json
cd temp
npm install
cd -

# Copy workspaces.

for WORKSPACE in api api-gateway arithmetic aws authentication binance binance-client cache database dflow env email-messages http locators logging models; do
	mkdir -p temp/node_modules/@workspace/$WORKSPACE/dist
	cp -R ../$WORKSPACE/dist/* temp/node_modules/@workspace/$WORKSPACE/dist/
	cp ../$WORKSPACE/package.json temp/node_modules/@workspace/$WORKSPACE/
done

# Zip lambdas.

for LAMBDA in callback order; do
	mkdir -p dist/$LAMBDA/node_modules
	cp temp/${LAMBDA}.js dist/$LAMBDA/index.js
	cp temp/package.json dist/$LAMBDA/
	cp -R temp/node_modules/* dist/$LAMBDA/node_modules/
	cd dist/$LAMBDA
	zip -X -r ../${LAMBDA}.zip * > /dev/null
	cd -
done
