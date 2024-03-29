#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,AWS_DATA_REGION=$AWS_DATA_REGION,AWS_SES_REGION=$AWS_SES_REGION,AUTHENTICATION_SECRET=$AUTHENTICATION_SECRET,DNS_DOMAIN=$DNS_DOMAIN,DEPLOY_STAGE=$DEPLOY_STAGE}"
