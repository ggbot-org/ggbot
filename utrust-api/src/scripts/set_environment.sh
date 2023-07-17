#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# callback

aws lambda update-function-configuration --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --environment "Variables={UTRUST_WEBHOOK_SECRET=$UTRUST_WEBHOOK_SECRET}"

# order

aws lambda update-function-configuration --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --environment "Variables={DEPLOY_STAGE=$DEPLOY_STAGE,UTRUST_API_KEY=$UTRUST_API_KEY}"
