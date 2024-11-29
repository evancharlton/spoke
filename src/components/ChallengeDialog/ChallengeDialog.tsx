import { useState } from "react";
import { useGame } from "../GameLogic";
import { useGameActions } from "../GameLogic";
import { isLetter } from "../../letters";
import classes from "./ChallengeDialog.module.css";

export const ChallengeDialog = () => {
  const { current } = useGame();
  const { answerChallenge } = useGameActions();
  const [input, setInput] = useState(current);

  return (
    <dialog
      className={classes.dialog}
      ref={(d) => d?.showModal()}
      onClose={() => answerChallenge(input)}
    >
      <h1>Utfordret</h1>
      <p>Du har blitt utfordret. Hvilke ord hadde du i tankene?</p>
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
        <button type="submit">✔️</button>
      </form>
      <hr />
      <form onSubmit={() => answerChallenge(current)}>
        <button type="submit">Jeg hadde ikke et ord</button>
      </form>
    </dialog>
  );
};
