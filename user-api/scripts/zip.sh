# Cleanup previous .zip files
rm -rf temp/*/index.zip

# Zip lambda.
cd temp/lambda
zip -r index.zip index.js*
cd -
