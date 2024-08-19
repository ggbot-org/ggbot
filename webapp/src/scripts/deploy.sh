#!/usr/bin/env bash

 # TODO conver it to TS script in infrastructure workspace
BUCKET=""

if [ "$DEPLOY_STAGE" == "main" ]; then
	BUCKET=www.${DNS_DOMAIN}
elif [ "$DEPLOY_STAGE" == "next" ]; then
	BUCKET=next.${DNS_DOMAIN}
else
	echo DEPLOY_STAGE must be main or next
	exit
fi

SCRIPTS_DIR=$(dirname "$0")
SRC_DIR=$(dirname "$SCRIPTS_DIR")
PACKAGE_DIR=$(dirname "$SRC_DIR")
PUBLIC_DIR=$PACKAGE_DIR/public

aws s3 sync $PUBLIC_DIR/ s3://$BUCKET --cache-control max-age=3600
