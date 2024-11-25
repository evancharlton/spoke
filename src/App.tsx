import "./App.css";
import { HashRouter, Route, Routes, useParams } from "react-router-dom";
import Page from "./components/Page";
import LanguageSelector from "./components/LanguageSelector";
import AppSetup from "./components/AppSetup";
import OpponentSelector from "./components/OpponentSelector";
import Play from "./components/Play";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Page />}>
          <Route path="" element={<LanguageSelector />} />
          <Route path=":lang" element={<AppSetup />}>
            <Route path="" element={<OpponentSelector />} />
            <Route path=":opponentId" element={<OpponentSelector />}>
              <Route path="" element={<Play />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
