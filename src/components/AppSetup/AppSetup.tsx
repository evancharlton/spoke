import { Outlet } from "react-router-dom";
import { TrieProvider } from "./TrieProvider/TrieProvider";

export const AppSetup = () => {
  return (
    <TrieProvider>
      <Outlet />
    </TrieProvider>
  );
};
