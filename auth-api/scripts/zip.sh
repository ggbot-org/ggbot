# Cleanup previous .zip files
rm -rf temp/*/index.zip

# Zip lambdas.

cd temp/enter
zip -r index.zip index.js*
cd -

cd temp/exit
zip -r index.zip index.js*
cd -

cd temp/verify
zip -r index.zip index.js*
cd -
