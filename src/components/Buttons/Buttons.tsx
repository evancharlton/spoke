import { useGame, useGameActions } from "../GameLogic";

export const Buttons = () => {
  const { current, playerIds } = useGame();
  const { challenge, declareVictory, myTurn } = useGameActions();

  const enoughLetters = current.length >= playerIds.length;

  return (
    <>
      <button disabled={!myTurn || !enoughLetters} onClick={() => challenge!()}>
        utfordre
      </button>
      <button
        disabled={!myTurn || !enoughLetters}
        onClick={() => declareVictory!()}
      >
        declare victory
      </button>
    </>
  );
};
