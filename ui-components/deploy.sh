BUCKET=design.ggbot2.com
BUILD_DIR=out

npm run cleanup
npm run test && npm run next:build && npm run next:export

aws s3 sync ${BUILD_DIR}/ s3://${BUCKET}
