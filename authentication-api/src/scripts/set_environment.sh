#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# enter

aws lambda update-function-configuration --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=${AWS_DATA_REGION},AWS_SES_REGION=${AWS_SES_REGION},DNS_DOMAIN=${DNS_DOMAIN},DEPLOY_STAGE=$DEPLOY_STAGE}"

# verify

aws lambda update-function-configuration --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=${AWS_DATA_REGION},DNS_DOMAIN=${DNS_DOMAIN},DEPLOY_STAGE=$DEPLOY_STAGE,JWT_SECRET=$JWT_SECRET}"
