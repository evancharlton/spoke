import { useGameActions } from "../GameLogic/context";

export const Buttons = () => {
  const { challenge, declareVictory, myTurn } = useGameActions();
  return (
    <>
      <button disabled={!myTurn} onClick={() => challenge!()}>
        utfordre
      </button>
      <button disabled={!myTurn} onClick={() => declareVictory!()}>
        declare victory
      </button>
    </>
  );
};
