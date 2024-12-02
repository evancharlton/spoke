import { useRef } from "react";
import { neverGuard } from "../../utils";
import {
  useCurrentPlayer,
  useGame,
  useGameActions,
  useNeighbors,
} from "../GameLogic";
import NaobLink from "../NaobLink";
import { findAlternate } from "../../trie";
import { useTrie } from "../AppSetup/TrieProvider";
import classes from "./GameOverDialog.module.css";
import { usePlayerInfo } from "../Players";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { newRound } = useGameActions();
  const ref = useRef<HTMLDialogElement | null>(null);
  return (
    <dialog
      className={classes.roundOver}
      ref={(dialog) => {
        ref.current = dialog;
        dialog?.showModal();
      }}
      onClose={newRound}
    >
      {children}
      <button onClick={() => ref.current?.close()}>neste runde</button>
    </dialog>
  );
};

export const GameOverDialog = () => {
  const trie = useTrie();
  const loserId = useCurrentPlayer();
  const { previous } = useNeighbors();
  const { resolution, current, endingWord } = useGame();
  const playerInfo = usePlayerInfo();
  const loserInfo = playerInfo(loserId);
  const previousInfo = playerInfo(previous);

  if (!resolution) {
    return null;
  }

  switch (resolution) {
    case "challenge -> fake word": {
      const possibility = findAlternate(trie, endingWord);

      return (
        <Modal>
          <p>
            {loserInfo.name} ble utfordet til å avsløre et ord som begynner med{" "}
            <code>{current}</code>.
          </p>
          <p>
            <span className={classes.unknownWord}>{endingWord}</span> ble
            avslørt, og er ikke kjent.
          </p>
          <p>
            Imidlertid kunne <NaobLink word={possibility} /> vært stavet i
            stedet.
          </p>
        </Modal>
      );
    }

    case "challenge -> real word": {
      return (
        <Modal>
          <p>
            {previousInfo.name} ble utfordret til å avsløre deres ord og{" "}
            <NaobLink word={endingWord} /> er gyldig.
          </p>
          <p>{loserInfo.name} har tapte delle runden.</p>
        </Modal>
      );
    }

    case "false-victory": {
      return (
        <Modal>
          <p>
            {loserInfo.name} hevdet at{" "}
            <span className={classes.unknownWord}>{current}</span> var et ord,
            men det er ikke kjent.
          </p>
          <p>
            Det kunne imidlertid vært brukt til å stave{" "}
            <NaobLink word={endingWord} />.
          </p>
        </Modal>
      );
    }

    case "word-spelled": {
      return (
        <Modal>
          <p>
            {loserInfo.name} stavet <NaobLink word={endingWord} />.
          </p>
        </Modal>
      );
    }

    case "overlooked-word": {
      return (
        <Modal>
          <p>
            {loserInfo.name} la ikke merke til at <NaobLink word={endingWord} />{" "}
            tidligere ble stavet.
          </p>
          <p>{loserInfo.name} har tapt denne runden.</p>
        </Modal>
      );
    }

    default: {
      return neverGuard(resolution, null);
    }
  }
};
