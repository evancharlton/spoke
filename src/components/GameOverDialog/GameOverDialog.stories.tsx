import { StoryObj } from "@storybook/react";
import { GameOverDialog } from "./GameOverDialog";
import { reactRouterParameters } from "storybook-addon-remix-react-router";
import { withTrie } from "../AppSetup/TrieProvider/withTrie";
import { withGameState } from "../GameLogic/withGameState";
import { GameState } from "../GameLogic";
import { withGameActions } from "../GameLogic/withGameActions";

export default {
  title: "components/GameOverDialog",
  component: GameOverDialog,
  decorators: [withTrie, withGameState, withGameActions],

  parameters: {
    gameState: {
      playerIds: ["human", "r"],
    },
    reactRouter: reactRouterParameters({
      location: {
        pathParams: {
          lang: "nb",
          opponentId: "r",
        },
      },
      routing: {
        path: `/:lang/:opponentId`,
      },
    }),
  },
};

type T = StoryObj<typeof GameOverDialog>;

export const StillGoing: T = {};

export const ChallengeFakeWord: T = {
  parameters: {
    gameState: {
      resolution: "challenge -> fake word",
    } satisfies Partial<GameState>,
  },
};
