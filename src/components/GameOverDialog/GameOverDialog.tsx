import { neverGuard } from "../../utils";
import {
  useCurrentPlayer,
  useGame,
  useGameActions,
  useNeighbors,
  usePlayerId,
} from "../GameLogic/context";
import NaobLink from "../NaobLink";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const { newRound } = useGameActions();
  return (
    <dialog ref={(dialog) => dialog?.showModal()} onClose={() => newRound()}>
      {children}
      <button onClick={() => newRound()}>New round</button>
    </dialog>
  );
};

export const GameOverDialog = () => {
  const loserId = useCurrentPlayer();
  const { previous } = useNeighbors();
  const playerId = usePlayerId();
  const { resolution, current, endingWord } = useGame();

  if (!resolution) {
    return null;
  }

  switch (resolution) {
    case "challenge -> fake word": {
      if (loserId === playerId) {
        return (
          <Modal>
            <h1>You lose</h1>
            <p>You tried to use {endingWord}, which isn't a known word</p>
          </Modal>
        );
      }

      return (
        <Modal>
          <h1>{loserId} loses</h1>
          <p>You tried to use {endingWord}, which isn't a known word</p>
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
