#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=$AWS_DATA_REGION,BINANCE_PROXY_IP=$BINANCE_PROXY_IP,DEPLOY_STAGE=$DEPLOY_STAGE,DNS_DOMAIN=$DNS_DOMAIN,AUTHENTICATION_SECRET=$AUTHENTICATION_SECRET}"
