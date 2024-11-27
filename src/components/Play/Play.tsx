import GameLogic, { useGame } from "../GameLogic";
import Players from "../Players";
import Scoreboard from "../Scoreboard";

const Status = () => {
  return <h1>{useGame().current}</h1>;
};

export const Play = () => {
  return (
    <GameLogic>
      <Scoreboard />
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
