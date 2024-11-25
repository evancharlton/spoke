import { useCallback, useEffect, useReducer } from "react";
import { Move } from "../../moves";
import { neverGuard } from "../../utils";
import { useTrie } from "../AppSetup/TrieProvider";
import { Opponent } from "../OpponentSelector/opponents";
import { Letter, Trie } from "../../trie";

export const PLAYERS = ["robot", "human"] as const;

type State = {
  currentPlayer: number;
  actions: Move[];
  current: string;
  winner: number | undefined;
  node: Trie | undefined;
};

type Update = Move | { move: "reset"; node: Trie };

export const reducer =
  (players: number) =>
  (state: State, update: Update): State => {
    const { move } = update;
    switch (move) {
      case "play": {
        const next = {
          ...state,
          currentPlayer: (state.currentPlayer + 1) % players,
          actions: [...state.actions, update],
          current: `${state.current}${update.letter}`,
          node: state.node?.[update.letter],
        };

        if (next.node?._?.length) {
          next.winner = next.currentPlayer;
        }

        return next;
      }

      case "challenge": {
        return {
          ...state,
          currentPlayer: (state.currentPlayer + 1) % players,
          actions: [...state.actions, update],
        };
      }

      case "forfeit": {
        return {
          ...state,
          currentPlayer: (state.currentPlayer + 1) % players,
          actions: [...state.actions, update],
        };
      }

      case "show": {
        return {
          ...state,
          currentPlayer: (state.currentPlayer + 1) % players,
          actions: [...state.actions, update],
          winner: state.currentPlayer,
        };
      }

      case "reset": {
        return {
          currentPlayer: 1,
          actions: [],
          current: "",
          winner: undefined,
          node: update.node,
        };
      }

      default: {
        return neverGuard(move, state);
      }
    }
  };

export const useGameState = ({ opponent }: { opponent: Opponent }) => {
  const trie = useTrie();

  const [state, dispatch] = useReducer(reducer(2), {
    currentPlayer: 1,
    actions: [],
    current: "",
    winner: undefined,
    node: trie,
  });

  const addLetter = useCallback((letter: Letter) => {
    dispatch({ move: "play", letter });
  }, []);

  const forfeit = useCallback(() => {
    dispatch({ move: "forfeit" });
  }, []);

  const challenge = useCallback(() => {
    dispatch({ move: "challenge" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ move: "reset", node: trie });
  }, [trie]);

  const lastAction = state.actions[state.actions.length - 1];

  useEffect(() => {
    if (state.currentPlayer !== 0) {
      return;
    }

    if (!lastAction) {
      // TODO: Can we have the robot start the game?
      return;
    }

    const { move } = lastAction;
    switch (move) {
      case "challenge": {
        opponent
          .challenge(trie, state.current)
          .then((response) => dispatch(response));
        break;
      }

      case "forfeit": {
        // The user has given up - nothing to do. Maybe gloat? lol
        opponent
          .challenge(trie, state.current)
          .then((response) => dispatch(response));
        break;
      }

      case "play": {
        opponent
          .play(trie, state.current)
          .then((response) => dispatch(response));
        break;
      }

      case "show": {
        // The user has shown their word.
        // TODO: Validate it.
        alert(`TODO: validate ${lastAction.word}`);
        break;
      }
    }
  }, [lastAction, opponent, state, state.currentPlayer, trie]);

  return {
    addLetter,
    challenge,
    forfeit,
    reset,
    lastAction,
    current: state.current,
    player: PLAYERS[state.currentPlayer],
    winner: state.winner,
  };
};
