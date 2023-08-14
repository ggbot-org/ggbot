#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --memory-size $ENTER_MEMORY_SIZE

aws lambda update-function-configuration --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --memory-size $VERIFY_MEMORY_SIZE
