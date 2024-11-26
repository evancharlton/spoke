import GameLogic, { useGame } from "../GameLogic";
import Players from "../Players";

const Status = () => {
  return <h1>{useGame().current}</h1>;
};

export const Play = () => {
  return (
    <GameLogic>
      <Status />
      <Players />
      <GameDebug />
    </GameLogic>
  );
};

const GameDebug = () => {
  const game = useGame();
  return <pre>{JSON.stringify(game, null, 2)}</pre>;
};
