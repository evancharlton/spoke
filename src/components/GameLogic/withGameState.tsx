import { makeDecorator } from "@storybook/preview-api";
import { GameStateContext } from "./context";
import { GameState } from "./state";

export const withGameState = makeDecorator({
  name: "withGameState",
  parameterName: "gameState",
  wrapper: (
    storyFn,
    context,
    { parameters: overrides = {} }: { parameters?: Partial<GameState> },
  ) => {
    const state: GameState = {
      player: overrides.player ?? 0,
      playerIds: overrides.playerIds ?? ["human"],
      losses: overrides.losses ?? {},
      current: overrides.current ?? "",
      endingWord: overrides.endingWord ?? "",
      actions: overrides.actions ?? [],
      gameOver: overrides.gameOver ?? false,
      resolution: overrides.resolution ?? undefined,
    };

    return (
      <GameStateContext.Provider value={state}>
        <>{storyFn(context)}</>
      </GameStateContext.Provider>
    );
  },
});
