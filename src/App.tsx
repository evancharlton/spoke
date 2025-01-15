import "./App.css";
import { HashRouter, Route, Routes } from "react-router";
import Page from "./components/Page";
import { LanguageProvider } from "./spa-components/LanguageSelector";
import AppSetup from "./components/AppSetup";
import OpponentSelector from "./components/OpponentSelector";
import Play from "./components/Play";
import { OpponentProvider } from "./components/OpponentSelector/OpponentSelector";
import PwaContainer from "./spa-components/PwaContainer";

function App() {
  return (
    <PwaContainer appId="spoke">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Page />}>
            <Route path="" element={<LanguageProvider />} />
            <Route
              path=":lang"
              element={
                <LanguageProvider>
                  <AppSetup />
                </LanguageProvider>
              }
            >
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
