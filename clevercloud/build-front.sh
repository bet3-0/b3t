#!/bin/bash -l

pushd front

npm install || exit 1
NODE_ENV=production npm run build || exit 1

popd
