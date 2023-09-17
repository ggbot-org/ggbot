#!/usr/bin/env bash

BUCKET=""

if [ "$DEPLOY_STAGE" == "main" ]; then
	BUCKET=app.ggbot2.com
elif [ "$DEPLOY_STAGE" == "next" ]; then
	BUCKET=next.ggbot2.com
else
	echo DEPLOY_STAGE must be main or next
	exit
fi

SCRIPTS_DIR=$(dirname "$0")
SRC_DIR=$(dirname "$SCRIPTS_DIR")
PACKAGE_DIR=$(dirname "$SRC_DIR")
PUBLIC_DIR=$PACKAGE_DIR/public

aws s3 sync $PUBLIC_DIR/ s3://$BUCKET
