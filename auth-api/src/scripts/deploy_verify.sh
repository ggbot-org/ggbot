source "$(dirname "$0")/_common_variables.sh"

aws lambda update-function-code --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --zip-file $VERIFY_FUNCTION_ZIP_FILE
