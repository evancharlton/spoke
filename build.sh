#!/usr/bin/env bash

npm run build \
  || exit $?

echo "spøke.no" >> dist/CNAME
