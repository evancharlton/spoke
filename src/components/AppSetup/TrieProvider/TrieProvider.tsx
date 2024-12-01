import { useEffect, useState } from "react";
import { Trie } from "../../../trie";
import { useParams } from "react-router-dom";
import { TrieContext } from "./context";

export const TrieProvider = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams();
  if (!lang) {
    throw new Error("Missing language parameter");
  }

  const [error, setError] = useState<Error | undefined>();
  const [trie, setTrie] = useState<Trie | undefined>(undefined);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}/${lang}/trie.json`.replace(/^\/\//, "/"))
      .then((res) => res.json() as Trie)
      .then((trie) => setTrie(trie))
      .catch((error) => setError(error));
  }, [lang]);

  if (error) {
    return <pre>{error.stack ?? "<error>"}</pre>;
  }

  if (!trie) {
    return <pre>Loading ...</pre>;
  }

  return <TrieContext.Provider value={trie}>{children}</TrieContext.Provider>;
};
