source "$(dirname "$0")/_common_variables.sh"

aws lambda update-function-code --region $AWS_REGION --function-name $EXIT_FUNCTION_NAME --zip-file $EXIT_FUNCTION_ZIP_FILE
