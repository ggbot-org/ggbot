#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $WEBHOOK_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID},AWS_DATA_REGION=${AWS_DATA_REGION},DNS_DOMAIN=${DNS_DOMAIN},DEPLOY_STAGE=$DEPLOY_STAGE},STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY},STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}"
