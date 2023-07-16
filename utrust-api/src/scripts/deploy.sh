#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# callback

aws lambda update-function-code --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --zip-file $CALLBACK_FUNCTION_ZIP_FILE

# order

aws lambda update-function-code --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --zip-file $ORDER_FUNCTION_ZIP_FILE
