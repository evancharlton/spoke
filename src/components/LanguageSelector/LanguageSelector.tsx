import { Link } from "react-router-dom";

export const LanguageSelector = () => {
  return (
    <>
      <Link to="/nb">bokmål</Link>
      <Link to="/nn">nynorsk</Link>
    </>
  );
};
