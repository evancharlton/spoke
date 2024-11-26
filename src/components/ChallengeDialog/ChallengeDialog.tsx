import { useEffect, useState } from "react";
import { useGame } from "../GameLogic";
import { useGameActions } from "../GameLogic/context";

export const ChallengeDialog = () => {
  const { current } = useGame();
  const { answerChallenge } = useGameActions();
  const [input, setInput] = useState(current);

  useEffect(() => {
    setInput(current);
  }, [current]);

  return (
    <dialog ref={(d) => d?.showModal()}>
      <h1>Prove it</h1>
      <hr />
      <input
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          if (!value.startsWith(current)) {
            return;
          }
          setInput(value);
        }}
        value={input}
      />
      <button
        onClick={() => {
          answerChallenge!(input);
        }}
      >
        &gt;
      </button>
    </dialog>
  );
};
