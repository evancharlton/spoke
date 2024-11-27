#!/usr/bin/env bash

npm ci \
  || exit $?
npm run build \
  || exit $?

echo "spøke.no" >> dist/CNAME
