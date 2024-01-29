#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws lambda update-function-code --region $AWS_REGION --function-name $ACTION_FUNCTION_NAME --zip-file $ACTION_FUNCTION_ZIP_FILE
