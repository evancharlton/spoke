#!/usr/bin/env zsh

mkdir -p public/nb/
mkdir -p public/nn/

node wordlist/spoke \
  || exit $?
jq -c < wordlist/spoke/nb/trie.json > public/nb/trie.json \
  || exit $?
jq -c < wordlist/spoke/nn/trie.json > public/nn/trie.json \
  || exit $?

npm run build \
  || exit $?

echo "spøke.no" >> dist/CNAME
