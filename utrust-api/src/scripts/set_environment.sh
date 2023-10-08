#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# callback

aws lambda update-function-configuration --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID},AWS_DATA_REGION=${AWS_DATA_REGION},DNS_DOMAIN=${DNS_DOMAIN},UTRUST_WEBHOOK_SECRET=$UTRUST_WEBHOOK_SECRET}"

# order

aws lambda update-function-configuration --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID},AWS_DATA_REGION=${AWS_DATA_REGION},DEPLOY_STAGE=$DEPLOY_STAGE,DNS_DOMAIN=${DNS_DOMAIN},JWT_SECRET=${JWT_SECRET},UTRUST_API_KEY=$UTRUST_API_KEY}"
