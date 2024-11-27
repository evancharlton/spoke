#!/usr/bin/env bash

npm ci \
  || exit $?
npm run build \
  || exit $?

echo "spoke.no" >> dist/CNAME
