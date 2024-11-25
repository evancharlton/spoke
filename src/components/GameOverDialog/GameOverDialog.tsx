import { useOpponent } from "../OpponentSelector/context";
import { usePlayContext } from "../Play";

export const GameOverDialog = () => {
  const { winner, lastAction } = usePlayContext();
  console.log(`TCL ~ GameOverDialog ~ lastAction:`, lastAction);
  const opponent = useOpponent();

  if (winner === 0) {
    return (
      <>
        <h1>{opponent.name} wins</h1>
        <div>
          They were thinking of{" "}
          {lastAction?.move === "show" ? lastAction.word : "???"}
        </div>
      </>
    );
  }

  if (winner === 1) {
    return <h1>You win</h1>;
  }

  return null;
};
