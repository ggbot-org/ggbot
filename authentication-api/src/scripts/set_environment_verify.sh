source "$(dirname "$0")/_common_variables.sh"

aws lambda update-function-configuration --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --environment "Variables={AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID,DEPLOY_STAGE=$DEPLOY_STAGE,GGBOT2_AUTHENTICATION_PRIVATE_KEY=$GGBOT2_AUTHENTICATION_PRIVATE_KEY}"
