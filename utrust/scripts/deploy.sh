# TODO
# organize better, port to JS

REGION=eu-central-1

aws lambda update-function-code --region $REGION --function-name ggbot2-utrust-callback --zip-file fileb://temp/callback/index.zip

aws lambda update-function-code --region $REGION --function-name ggbot2-utrust-order --zip-file fileb://temp/order/index.zip
