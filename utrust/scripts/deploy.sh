source "$(dirname "$0")/_functions.sh"

aws lambda update-function-code --region $AWS_REGION --function-name $CALLBACK_FUNCTION_NAME --zip-file $CALLBACK_FUNCTION_ZIP_FILE

aws lambda update-function-code --region $AWS_REGION --function-name $ORDER_FUNCTION_NAME --zip-file $ORDER_FUNCTION_ZIP_FILE
