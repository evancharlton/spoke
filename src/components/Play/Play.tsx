import GameLogic, { useGame } from "../GameLogic";
import Players from "../Players";
import Status from "../Status";

export const Play = () => {
  return (
    <GameLogic>
      <Status />
      <Players />
      {import.meta.env.DEV ? <GameDebug /> : null}
    </GameLogic>
  );
};

const GameDebug = () => {
  const game = useGame();
  return <pre>{JSON.stringify(game, null, 2)}</pre>;
};
