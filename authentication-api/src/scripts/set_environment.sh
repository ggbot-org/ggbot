#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# enter

aws lambda update-function-configuration --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --environment "Variables={DEPLOY_STAGE=$DEPLOY_STAGE}"

# verify

aws lambda update-function-configuration --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --environment "Variables={DEPLOY_STAGE=$DEPLOY_STAGE,JWT_SECRET=$JWT_SECRET}"