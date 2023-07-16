#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# enter

aws lambda create-function --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file $ENTER_FUNCTION_ZIP_FILE

aws logs create-log-group --region $AWS_REGION --log-group-name $ENTER_FUNCTION_LOG_GROUP_NAME

# verify

aws lambda create-function --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file $VERIFY_FUNCTION_ZIP_FILE

aws logs create-log-group --region $AWS_REGION --log-group-name $VERIFY_FUNCTION_LOG_GROUP_NAME
