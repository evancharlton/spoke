import { Letter } from "../../trie";
import { neverGuard } from "../../spa-components/neverGuard";
import { PlayerId } from "../Players";

export type Action =
  | { move: "new-game" }
  | { move: "new-round" }
  | { move: "add-letter"; letter: Letter }
  | { move: "challenge" }
  | { move: "challenge -> real word"; word: string }
  | { move: "challenge -> fake word"; word: string }
  | { move: "word-spelled" }
  | { move: "overlooked-word"; word: string }
  | { move: "defeated"; word: string }
  | { move: "false-victory"; possibleWord: string };

export type GameState = {
  player: number;
  playerIds: PlayerId[];
  losses: Record<PlayerId, number>;
  current: string;
  endingWord: string;
  actions: (Action & { playerId: PlayerId })[];
  gameOver: boolean;
  resolution:
    | undefined
    | "challenge -> real word"
    | "challenge -> fake word"
    | "word-spelled"
    | "overlooked-word"
    | "false-victory";
};

const stateReducer = (state: GameState, action: Action): GameState => {
  const { move } = action;
  if (move === "new-round") {
    return {
      ...state,
      player:
        Object.values(state.losses).reduce((acc, v) => acc + v, 0) %
        state.playerIds.length,
      current: "",
      endingWord: "",
      resolution: undefined,
    };
  }

  if (move === "new-game") {
    return {
      player: 0,
      playerIds: state.playerIds,
      losses: {} as Record<PlayerId, number>,
      current: "",
      endingWord: "",
      actions: [],
      gameOver: false,
      resolution: undefined,
    };
  }

  if (state.resolution) {
    return state;
  }

  switch (move) {
    case "add-letter": {
      return {
        ...state,
        player: (state.player + 1) % state.playerIds.length,
        current: `${state.current}${action.letter}`,
      };
    }

    case "challenge": {
      return {
        ...state,
        // Reverse the order .. but watch out for JS' negative mods!
        player:
          (state.player + state.playerIds.length - 1) % state.playerIds.length,
      };
    }

    case "challenge -> fake word": {
      // The current string cannot form a word. This means that the current
      // player loses.
      const loserIndex = state.player;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;
      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "challenge -> fake word",
        endingWord: action.word,
      };
    }

    case "challenge -> real word": {
      // The current string *can* form a real word. This means that the
      // challenger -- the next player in line -- is the loser.

      const loserIndex =
        (state.player + state.playerIds.length + 1) % state.playerIds.length;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;

      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "challenge -> real word",
        endingWord: action.word,
      };
    }

    case "word-spelled": {
      // The current player noticed that a word was spelled. This means that
      // the *previous* player is the loser.

      const loserIndex =
        (state.player + state.playerIds.length - 1) % state.playerIds.length;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;

      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "word-spelled",
        endingWord: state.current,
      };
    }

    case "defeated": {
      const loserIndex = state.player;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;
      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "word-spelled",
        endingWord: action.word,
      };
    }

    case "false-victory": {
      // The current player *claimed* that the current string was a real word,
      // when in fact it was not. This means that the current player loses.
      const loserIndex = state.player;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;

      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "false-victory",
        endingWord: action.possibleWord,
      };
    }

    case "overlooked-word": {
      // The previous player failed to notice that a word had already been
      // spelled. For this omission, they lose - it's a harsh world out there.

      const loserIndex =
        (state.player + state.playerIds.length - 1) % state.playerIds.length;
      const loserId = state.playerIds[loserIndex];
      state.losses[loserId] = state.losses[loserId] ?? 0;

      return {
        ...state,
        losses: {
          ...state.losses,
          [loserId]: state.losses[loserId] + 1,
        },
        player: loserIndex,
        resolution: "overlooked-word",
        endingWord: action.word,
      };
    }

    default: {
      return neverGuard(move, state);
    }
  }
};

export const reducer: typeof stateReducer = (state, action) => {
  const currentPlayerId = state.playerIds[state.player];
  const next = stateReducer(state, action);
  if (next === state) {
    return next;
  }

  next.actions = [
    {
      ...action,
      playerId: currentPlayerId || "<not started yet>",
    },
    ...state.actions,
  ];

  const loser = Object.keys(next.losses).filter(
    (id) => next.losses[id as PlayerId] >= 5,
  )[0];

  if (loser) {
    return {
      ...next,
      gameOver: true,
      playerId: loser,
    };
  }

  return next;
};
