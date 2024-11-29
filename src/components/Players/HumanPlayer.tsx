import ChallengeDialog from "../ChallengeDialog";
import { useGame } from "../GameLogic";
import { useGameActions } from "../GameLogic/context";
import GameOverDialog from "../GameOverDialog";
import Keyboard from "../Keyboard";

export const HumanPlayer = () => {
  const { actions, current } = useGame();
  const { myTurn } = useGameActions();

  const showChallengeDialog = actions[0]?.move === "challenge" && myTurn;

  return (
    <>
      <Keyboard disabled={showChallengeDialog} />
      {showChallengeDialog ? <ChallengeDialog key={current} /> : null}
      <GameOverDialog />
    </>
  );
};
