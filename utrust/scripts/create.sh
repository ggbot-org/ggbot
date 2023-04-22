# TODO
# organize better, put lambda function names in infrastructure package

REGION=eu-central-1
RUNTIME=nodejs18.x
ROLE=arn:aws:iam::$AWS_ACCOUNT_ID:role/ggbot2_api_role

aws lambda create-function --region $REGION --function-name ggbot2-utrust-callback --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file fileb://temp/callback/index.zip

aws lambda create-function --region $REGION --function-name ggbot2-utrust-order --runtime $RUNTIME --handler index.handler --role $ROLE --zip-file fileb://temp/order/index.zip

