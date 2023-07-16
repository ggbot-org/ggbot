DIR=$(dirname "$0")
source $DIR/_common_variables.sh

# enter

aws lambda update-function-code --region $AWS_REGION --function-name $ENTER_FUNCTION_NAME --zip-file $ENTER_FUNCTION_ZIP_FILE

# verify

aws lambda update-function-code --region $AWS_REGION --function-name $VERIFY_FUNCTION_NAME --zip-file $VERIFY_FUNCTION_ZIP_FILE
