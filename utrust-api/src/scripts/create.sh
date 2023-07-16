#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# callback

aws lambda create-function --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file $CALLBACK_FUNCTION_ZIP_FILE

aws logs create-log-group --region $AWS_REGION --log-group-name $CALLBACK_FUNCTION_LOG_GROUP_NAME

# order

aws lambda create-function --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file $ORDER_FUNCTION_ZIP_FILE

aws logs create-log-group --region $AWS_REGION --log-group-name $ORDER_FUNCTION_LOG_GROUP_NAME
