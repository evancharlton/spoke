import { useCallback, useMemo, useState } from "react";
import { useTrie } from "../AppSetup/TrieProvider";
import { useOpponent } from "../OpponentSelector/context";

export const Play = () => {
  const opponent = useOpponent();
  const trie = useTrie();

  const [current, setCurrent] = useState("");
  const [input, setInput] = useState("");

  const add = useCallback(() => {
    if (input.length !== 1) {
      alert(input.length);
      throw new Error("wrong");
    }

    setCurrent((v) => v + input.toLocaleLowerCase());
    setInput("");
  }, [input]);

  const backspace = useCallback(() => {
    setCurrent((v) => v.substring(0, Math.max(0, v.length - 1)));
  }, []);

  const next = useMemo(() => {
    return opponent.play(trie, current);
  }, [current]);

  const challenge = useMemo(() => {
    return opponent.challenge(trie, current);
  }, [current]);

  return (
    <>
      <h3>{current}</h3>
      <input
        type="text"
        value={input}
        onSubmit={() => add()}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => add()}>Add</button>
      <button onClick={() => backspace()}>&lt;</button>
      <pre>{JSON.stringify(next, null, 2)}</pre>
      <pre>{JSON.stringify(challenge, null, 2)}</pre>
    </>
  );
};
