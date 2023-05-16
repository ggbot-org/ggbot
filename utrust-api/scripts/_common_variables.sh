RUNTIME=nodejs18.x
# TODO create a ggbot2-main-api-role ggbot2-next-api-role ggbot2-local-api-role (copy of next)
ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role

CALLBACK_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-utrust-callback"
CALLBACK_FUNCTION_LOG_GROUP_NAME=/aws/lambda/$CALLBACK_FUNCTION_NAME
CALLBACK_FUNCTION_ZIP_FILE=fileb://temp/callback/index.zip

ORDER_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-utrust-order"
ORDER_FUNCTION_LOG_GROUP_NAME=/aws/lambda/$ORDER_FUNCTION_NAME
ORDER_FUNCTION_ZIP_FILE=fileb://temp/order/index.zip
