import { useRef } from "react";
import { neverGuard } from "../../utils";
import {
  useCurrentPlayer,
  useGame,
  useGameActions,
  useNeighbors,
  usePlayerId,
} from "../GameLogic/context";
import NaobLink from "../NaobLink";
import { findAlternate } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";

const Modal = ({
  children,
  onClose,
  text = "New round",
}: {
  children: React.ReactNode;
  text?: string;
  onClose?: () => void;
}) => {
  const { newRound } = useGameActions();
  const ref = useRef<HTMLDialogElement | null>(null);
  return (
    <dialog
      ref={(dialog) => {
        ref.current = dialog;
        dialog?.showModal();
      }}
      onClose={onClose ?? newRound}
    >
      {children}
      <button onClick={() => ref.current?.close()}>{text}</button>
    </dialog>
  );
};

export const GameOverDialog = () => {
  const trie = useTrie();
  const loserId = useCurrentPlayer();
  const { previous } = useNeighbors();
  const playerId = usePlayerId();
  const { resolution, current, endingWord, gameOver } = useGame();

  if (gameOver) {
    return (
      <Modal onClose={() => location.reload()} text="New game">
        <h1>{loserId} loses</h1>
      </Modal>
    );
  }

  if (!resolution) {
    return null;
  }

  switch (resolution) {
    case "challenge -> fake word": {
      const possibility = findAlternate(trie, endingWord);

      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>
              You tried to use {endingWord}, which isn't a known word. However,{" "}
              <NaobLink word={possibility} /> could have been spelled earlier.
            </p>
          </Modal>
        );
      }

      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>
            {loserId} tried to use {endingWord}, which isn't a known word.
            However, <NaobLink word={possibility} /> could have been spelled
            earlier.
          </p>
        </Modal>
      );
    }

    case "challenge -> real word": {
      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>
              You challenged {previous} who was thinking of using {current} to
              spell <NaobLink word={endingWord} />
            </p>
          </Modal>
        );
      }
      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>
            {loserId} challenged {previous} who was thinking of using {current}{" "}
            to spell <NaobLink word={endingWord} />
          </p>
        </Modal>
      );
    }

    case "false-victory": {
      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>
              You claimed {current} was a word, but it isn't (however, it could
              be used to spell <NaobLink word={endingWord} />)
            </p>
          </Modal>
        );
      }
      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>
            {loserId} claimed {current} was a word, but it isn't (however, it
            could be used to spell <NaobLink word={endingWord} />)
          </p>
        </Modal>
      );
    }

    case "word-spelled": {
      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>
              You spelled <NaobLink word={endingWord} />, which is a real word
            </p>
          </Modal>
        );
      }
      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>
            They spelled <NaobLink word={endingWord} />, which is a real word
          </p>
        </Modal>
      );
    }

    case "overlooked-word": {
      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>
              You failed to notice that <NaobLink word={endingWord} /> was
              previously spelled in {current}
            </p>
          </Modal>
        );
      }
      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>
            {loserId} failed to notice that <NaobLink word={endingWord} /> was
            previously spelled in {current}
          </p>
        </Modal>
      );
    }

    default: {
      return neverGuard(resolution, null);
    }
  }
};
