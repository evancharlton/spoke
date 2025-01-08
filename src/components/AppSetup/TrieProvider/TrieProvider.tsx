import { Trie } from "../../../trie";
import { TrieContext } from "./context";
import classes from "./TrieProvider.module.css";
import { Loader } from "../../../spa-components/Loader";
import { useLanguageData } from "../../../spa-components/DataProvider";

export const TrieProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: trie, error } = useLanguageData<Trie>("trie.json");

  if (error) {
    console.error(error);
    return <div className={classes.container}>⚠️</div>;
  }

  if (!trie) {
    return <Loader text="laster ned ..." />;
  }

  return <TrieContext.Provider value={trie}>{children}</TrieContext.Provider>;
};
