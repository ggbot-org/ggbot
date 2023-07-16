#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,BINANCE_PROXY_BASE_URL=$BINANCE_PROXY_BASE_URL,DEPLOY_STAGE=$DEPLOY_STAGE,JWT_SECRET=$JWT_SECRET}"
