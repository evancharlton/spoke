import { makeDecorator } from "@storybook/preview-api";
import { TrieContext } from "./context";
import { Letter, Trie } from "../../../trie";

export const withTrie = makeDecorator({
  name: "withTrie",
  parameterName: "trie",
  wrapper: (storyFn, context, { parameters }) => {
    return (
      <TrieContext.Provider
        value={
          parameters
            ? Array.isArray(parameters)
              ? makeTrie(parameters)
              : parameters
            : SB_TRIE
        }
      >
        <>{storyFn(context)}</>
      </TrieContext.Provider>
    );
  },
});

const makeTrie = (words: string[]): NonNullable<Trie> => {
  const root: NonNullable<Trie> = {};

  for (const word of words) {
    let node = root;
    for (let i = 0; i < word.length; i += 1) {
      const letter = word[i] as Letter;
      node[letter] = node[letter] ?? {};
      const next = node[letter];
      node = next;
    }
    node._ = node._ ?? [];
    node._.push(word);
  }

  return root;
};

const SB_TRIE: NonNullable<Trie> = makeTrie([
  "abc",
  "aaaa",
  "aaab",
  "abcd",
  "bcde",
  "bccba",
]);
