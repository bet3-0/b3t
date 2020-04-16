npm run build
rm -rf ../site/*
cp -r dist/* ../site
echo "Deployed in ../site/"