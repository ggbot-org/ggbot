#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --memory-size $ACTION_MEMORY_SIZE

aws lambda update-function-configuration --region $AWS_REGION --function-name $WEBHOOK_FUNCTION_NAME --memory-size $WEBHOOK_MEMORY_SIZE
