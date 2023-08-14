#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --timeout $CALLBACK_TIMEOUT

aws lambda update-function-configuration --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --timeout $ORDER_TIMEOUT
