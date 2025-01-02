import { Outlet } from "react-router";
import { TrieProvider } from "./TrieProvider/TrieProvider";

export const AppSetup = () => {
  return (
    <TrieProvider>
      <Outlet />
    </TrieProvider>
  );
};
