#!/bin/bash -l

set -x

pushd front

NODE_ENV=production npm install
NODE_ENV=production npm run build

popd
