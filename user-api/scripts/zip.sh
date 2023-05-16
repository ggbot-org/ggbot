# Cleanup previous .zip files
rm -rf temp/*/index.zip

# Zip lambdas.

cd temp/action
zip -r index.zip index.js*
cd -
