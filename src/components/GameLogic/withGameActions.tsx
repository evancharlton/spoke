import { makeDecorator } from "@storybook/preview-api";
import { ContextType } from "react";
import { GameActionsContext } from "./context";
import { fn } from "@storybook/test";

export const withGameActions = makeDecorator({
  name: "withGameActions",
  parameterName: "gameActions",
  wrapper: (
    storyFn,
    context,
    {
      parameters: actions = {},
    }: {
      parameters?: Partial<NonNullable<ContextType<typeof GameActionsContext>>>;
    },
  ) => {
    const value: NonNullable<ContextType<typeof GameActionsContext>> = {
      addLetter: actions.addLetter ?? fn(),
      challenge: actions.challenge ?? fn(),
      answerChallenge: actions.answerChallenge ?? fn(),
      declareVictory: actions.declareVictory ?? fn(),
      admitDefeat: actions.admitDefeat ?? fn(),
      newRound: actions.newRound ?? fn(),
      newGame: actions.newGame ?? fn(),
    };

    return (
      <GameActionsContext.Provider value={value}>
        <>{storyFn(context)}</>
      </GameActionsContext.Provider>
    );
  },
});
