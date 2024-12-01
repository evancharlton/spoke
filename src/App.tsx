import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Page from "./components/Page";
import LanguageSelector from "./components/LanguageSelector";
import AppSetup from "./components/AppSetup";
import OpponentSelector from "./components/OpponentSelector";
import Play from "./components/Play";
import { OpponentProvider } from "./components/OpponentSelector/OpponentSelector";
import { PwaContainer } from "./components/PwaContainer";

function App() {
  return (
    <PwaContainer>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="" element={<LanguageSelector />} />
            <Route path=":lang" element={<AppSetup />}>
              <Route path="" element={<OpponentSelector />} />
              <Route path=":opponentId" element={<OpponentProvider />}>
                <Route path="" element={<Play />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </PwaContainer>
  );
}

export default App;
