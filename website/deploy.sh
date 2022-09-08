BUCKET=www.ggbot2.com
BUILD_DIR=out

aws s3 sync --exclude ${BUILD_DIR}/privacy.html --exclude ${BUILD_DIR}/terms.html ${BUILD_DIR}/ s3://${BUCKET}

aws s3 cp --content-type 'text/html' ${BUILD_DIR}/terms.html s3://${BUCKET}/terms
aws s3 cp --content-type 'text/html' ${BUILD_DIR}/privacy.html s3://${BUCKET}/privacy
