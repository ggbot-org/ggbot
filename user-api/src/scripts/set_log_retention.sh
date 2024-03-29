#!/usr/bin/env bash

DIR=$(dirname "$0")
source $DIR/_common_variables.sh

aws logs put-retention-policy --region $AWS_REGION --log-group-name $ACTION_FUNCTION_LOG_GROUP_NAME --retention-in-days $ACTION_LOG_RETENTION_DAYS
