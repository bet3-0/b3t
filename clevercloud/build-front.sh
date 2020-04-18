#!/bin/bash -l

pushd front
export NODE_ENV=production
npm install
npm run build

