import { useOpponent } from "../OpponentSelector/context";
import Keyboard from "../Keyboard";
import { PlayContext, usePlayContext } from "./context";
import { useGameState } from "./state";
import Buttons from "../Buttons";
import { useTrie } from "../AppSetup/TrieProvider";
import ChallengeDialog from "../ChallengeDialog";
import GameOverDialog from "../GameOverDialog";

export const Play = () => {
  const opponent = useOpponent();
  const game = useGameState({ opponent });

  const playerChallenged =
    game.player === "human" && game.lastAction?.move === "challenge";

  return (
    <PlayContext.Provider value={game}>
      <h3>{game.current}</h3>
      <Keyboard />
      <Buttons />
      <GameOverDialog />
      {playerChallenged ? <ChallengeDialog /> : null}
      <Debug />
    </PlayContext.Provider>
  );
};

const Debug = () => {
  const opponent = useOpponent();
  const trie = useTrie();
  const { current } = usePlayContext();

  if (!current) {
    return null;
  }

  return <pre>{JSON.stringify(opponent.all(trie, current), null, 2)}</pre>;
};
