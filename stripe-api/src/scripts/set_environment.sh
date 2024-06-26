#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --environment "Variables={AUTHENTICATION_SECRET=${AUTHENTICATION_SECRET},AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=$AWS_DATA_REGION,DNS_DOMAIN=$DNS_DOMAIN,DEPLOY_STAGE=$DEPLOY_STAGE,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY,STRIPE_PLAN_BASIC_PRICE_ID=$STRIPE_PLAN_BASIC_PRICE_ID}"

aws lambda update-function-configuration --region $AWS_REGION --function-name $WEBHOOK_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=$AWS_DATA_REGION,DNS_DOMAIN=$DNS_DOMAIN,DEPLOY_STAGE=$DEPLOY_STAGE,STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY}"
