import { createContext, useContext } from "react";
import { Trie } from "../../../trie";

export const TrieContext = createContext<Trie | undefined>(undefined);

export const useTrie = () => {
  const trie = useContext(TrieContext);
  if (!trie) {
    throw new Error("Must be used inside of <TrieProvider />!");
  }
  return trie;
};
