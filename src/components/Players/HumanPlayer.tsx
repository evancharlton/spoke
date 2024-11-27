import ChallengeDialog from "../ChallengeDialog";
import { useGame } from "../GameLogic";
import { useCurrentPlayer, usePlayerId } from "../GameLogic/context";
import RoundOverDialog from "../GameOverDialog";
import Keyboard from "../Keyboard";

export const HumanPlayer = () => {
  const { actions, current } = useGame();
  const currentPlayer = useCurrentPlayer();
  const myId = usePlayerId();

  const showChallengeDialog =
    actions[0]?.move === "challenge" && currentPlayer === myId;

  return (
    <>
      <Keyboard />
      {showChallengeDialog ? <ChallengeDialog key={current} /> : null}
      <RoundOverDialog />
    </>
  );
};
