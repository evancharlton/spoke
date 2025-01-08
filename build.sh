#!/usr/bin/env bash

npm ci \
  || exit $?
npm run build \
  || exit $?

echo "xn--spke-hra.no" >> dist/CNAME
 wordlists ..."
find wordlist/stavehumle \
  -mindepth 1 \
  -maxdepth 1 \
  -type d \
  -exec cp -Rv {} public/ \; \
|| exit $?