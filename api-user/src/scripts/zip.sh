#!/usr/bin/env bash

for LAMBDA in action; do
	DIST_DIR=dist/$LAMBDA

	# Cleanup previous .zip file.
	rm -rf dist/${LAMBDA}.zip

	# Install external deps.
	mkdir -p $DIST_DIR
	cp external-dependencies.json $DIST_DIR/package.json
	cd $DIST_DIR
	npm install
	cd -

	# Copy internal deps.
	for WORKSPACE in api authentication database dflow env http locators models s3-data-bucket; do
		WORKSPACE_DIR=$DIST_DIR/node_modules/@workspace/$WORKSPACE
		mkdir -p $WORKSPACE_DIR/dist
		cp -R ../$WORKSPACE/dist/* $WORKSPACE_DIR/dist
		cp ../$WORKSPACE/package.json $WORKSPACE_DIR
	done

	# Zip lambda.
	cp temp/lambdas/${LAMBDA}/*.js $DIST_DIR
	cd $DIST_DIR
	zip -X -r ../${LAMBDA}.zip * > /dev/null
	cd -
done
