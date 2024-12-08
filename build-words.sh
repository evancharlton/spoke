#!/usr/bin/env zsh

mkdir -p public/nb{,-1}/
mkdir -p public/nn{,-1}/

jq -c < wordlist/spoke/nb-1/trie.json > public/nb-1/trie.json \
  || exit $?
jq -c < wordlist/spoke/nn-1/trie.json > public/nn-1/trie.json \
  || exit $?
jq -c < wordlist/spoke/nb/trie.json > public/nb/trie.json \
  || exit $?
jq -c < wordlist/spoke/nn/trie.json > public/nn/trie.json \
  || exit $?
