source "$(dirname "$0")/_common_variables.sh"

aws lambda update-function-configuration --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --environment "Variables={UTRUST_WEBHOOK_SECRET=$UTRUST_WEBHOOK_SECRET}"
