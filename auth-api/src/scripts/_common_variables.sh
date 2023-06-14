RUNTIME=nodejs18.x
# TODO create a ggbot2-main-api-role ggbot2-next-api-role ggbot2-local-api-role (copy of next)
ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role

ENTER_FUNCTION_NAME="ggbot2-${DEPLOY_STAGE}-enter"
ENTER_FUNCTION_LOG_GROUP_NAME=/aws/lambda/$ENTER_FUNCTION_NAME
ENTER_FUNCTION_ZIP_FILE=fileb://temp//index.zip
