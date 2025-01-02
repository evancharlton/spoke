import { useEffect, useState } from "react";
import { Trie } from "../../../trie";
import { useParams } from "react-router";
import { TrieContext } from "./context";
import classes from "./TrieProvider.module.css";
import { Loader } from "../../../spa-components/Loader";

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
    console.error(error);
    return <div className={classes.container}>⚠️</div>;
  }

  if (!trie) {
    return <Loader text="laster ned ..." />;
  }

  return <TrieContext.Provider value={trie}>{children}</TrieContext.Provider>;
};
