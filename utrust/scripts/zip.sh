# Cleanup previous .zip files
rm -rf temp/*/index.zip

# Zip lambdas.

cd temp/callback
zip -r index.zip index.js*
cd -

cd temp/order
zip -r index.zip index.js*
cd -
