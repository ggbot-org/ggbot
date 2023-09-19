#!/usr/bin/env bash

# Cleanup previous .zip files

rm -rf dist/*/index.zip

# Install external deps.

### TODO generate temp/package.json file reading from other package.json
#        files, use a node script
echo '{ "name": "lambda", "type": "module", "dependencies": { "@aws-sdk/client-ec2": "3.379.1", "@aws-sdk/client-iam": "3.379.1", "@aws-sdk/client-s3": "3.379.1", "@aws-sdk/client-ses": "3.379.1", "dflow": "0.42.0", "flow-view": "6.0.1", "minimal-time-helpers": "0.1.0", "minimal-type-guard-helpers": "0.1.1" } }' > temp/package.json
cd temp
npm install
cd -

# Copy workspaces.

for INTERNAL_DEP in api-gateway arithmetic aws binance binance-client cache database dflow env email-messages infrastructure locators models; do
	mkdir -p temp/node_modules/@workspace/$INTERNAL_DEP/dist
	cp -R ../$INTERNAL_DEP/dist/* temp/node_modules/@workspace/$INTERNAL_DEP/dist/
	cp ../$INTERNAL_DEP/package.json temp/node_modules/@workspace/$INTERNAL_DEP/
done

for WORKSPACE in api http; do
	mkdir -p temp/node_modules/@workspace/$WORKSPACE/dist
	cp -R ../$WORKSPACE/dist/* temp/node_modules/@workspace/$WORKSPACE/dist/
	cp ../$WORKSPACE/package.json temp/node_modules/@workspace/$WORKSPACE/
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
