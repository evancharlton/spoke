#!/usr/bin/env bash

npm ci \
  || exit $?
npm run build \
  || exit $?

echo "xn--spke-hra.no" >> dist/CNAME
