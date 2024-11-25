import { usePlayContext } from "../Play";

export const Buttons = () => {
  const { challenge, forfeit, reset, current } = usePlayContext();
  return (
    <>
      <button onClick={() => challenge()}>utfordre</button>
      <button onClick={() => forfeit()} disabled={!current}>
        gi opp
      </button>
      <button onClick={() => reset()}>reset</button>
    </>
  );
};
