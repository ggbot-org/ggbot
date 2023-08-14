#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-configuration --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --timeout $ENTER_TIMEOUT

aws lambda update-function-configuration --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --timeout $VERIFY_TIMEOUT
