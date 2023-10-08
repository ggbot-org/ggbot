#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# webhook

aws lambda create-function --region $AWS_REGION --function-name $WEBHOOK_FUNCTION_NAME --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file $WEBHOOK_FUNCTION_ZIP_FILE

aws logs create-log-group --region $AWS_REGION --log-group-name $WEBHOOK_FUNCTION_LOG_GROUP_NAME
