import { useState } from "react";
import { usePlayContext } from "../Play";

export const ChallengeDialog = () => {
  const { current } = usePlayContext();
  const [input, setInput] = useState(current);

  return (
    <dialog ref={(d) => d?.showModal()}>
      <h1>Prove it</h1>
      <hr />
      <input
        type="text"
        onChange={(e) => {
          const value = e.target.value;
          if (!value.startsWith(current)) {
            return;
          }
          setInput(value);
        }}
        value={input}
      />
    </dialog>
  );
};
