#!/usr/bin/env bash

for LAMBDA in action; do
	DIST_DIR=dist/$LAMBDA

	# Cleanup previous .zip file.
	rm -rf dist/${LAMBDA}.zip

	# Install external deps.
	mkdir -p $DIST_DIR
	cp src/lambdas/$LAMBDA/external-dependencies.json $DIST_DIR/package.json
	cd $DIST_DIR
	npm install
	cd -

	# Copy internal deps.
	for WORKSPACE in api api-gateway arithmetic aws binance binance-client cache database dflow env email-messages http locators logging models; do
		WORKSPACE_DIST_DIR=dist/$LAMBDA/node_modules/@workspace/$WORKSPACE/dist
		mkdir -p $WORKSPACE_DIST_DIR
		cp -R ../$WORKSPACE/dist/* $WORKSPACE_DIST_DIR
		cp ../$WORKSPACE/package.json $WORKSPACE_DIST_DIR
	done

	# Zip lambda.
	cp temp/lambdas/${LAMBDA}/*.js dist/$LAMBDA/
	cd $DIST_DIR
	zip -X -r ../${LAMBDA}.zip * > /dev/null
	cd -
done
