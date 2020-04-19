#!/bin/bash -l

pushd front

npm --production=false install --no-progress || exit 1
NODE_ENV=production npm run build || exit 1
cp public/img/icons/* dist/img/icons/

popd
