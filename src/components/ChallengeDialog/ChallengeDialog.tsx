import { useState } from "react";
import { useGame } from "../GameLogic";
import { useGameActions } from "../GameLogic/context";
import { isLetter } from "../../letters";

export const ChallengeDialog = () => {
  const { current } = useGame();
  const { answerChallenge } = useGameActions();
  const [input, setInput] = useState(current);

  return (
    <dialog ref={(d) => d?.showModal()} onClose={() => answerChallenge(input)}>
      <h1>Prove it</h1>
      <hr />
      <form onSubmit={() => answerChallenge(input)}>
        <input
          type="text"
          onChange={(e) => {
            const value = e.target.value;
            if (!value.startsWith(current)) {
              return;
            }
            setInput(
              value
                .split("")
                .filter((v) => isLetter(v))
                .join("")
            );
          }}
          value={input}
        />
        <button type="submit">&gt;</button>
      </form>
    </dialog>
  );
};
