import { useEffect, useState } from "react";
import { MdHelpOutline } from "react-icons/md";
import classes from "./HelpDialog.module.css";
import { Modal } from "../../spa-components/Modal";

const AUTO_OPEN_KEY = "spøke/help/last-shown";
const AUTO_OPEN_INTERVAL = 31 * 24 * 60 * 60 * 1000;

export const HelpDialog = () => {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    const lastShownMillis = +(localStorage.getItem(AUTO_OPEN_KEY) || 0);
    if (Date.now() - lastShownMillis > AUTO_OPEN_INTERVAL) {
      setShowing(true);
      localStorage.setItem(AUTO_OPEN_KEY, String(Date.now()));
    }
  }, []);

  return (
    <>
      <button onClick={() => setShowing(true)}>
        <MdHelpOutline />
      </button>
      <Modal
        open={showing}
        className={classes.helpDialog}
        title="Om Spøke"
        onClose={() => setShowing(false)}
      >
        <div className={classes.gameplay}>
          <ol>
            <li>
              Spillere bytter på å legge til bokstaver med mål om å lage et ord.
            </li>
            <li>
              Spilleren som staver et ord taper, og får en «S» (deretter «P»,
              deretter «Ø», &hellip;)
            </li>
            <li>Når en spiller fullfører «SPØKE», taper de spillet.</li>
          </ol>

          <p>I stedet for å legge til en bokstav, kan en spiller:</p>
          <ul>
            <li>
              utfordre (🤔) og kreve at den forrige spilleren avslører ordet
              sitt
            </li>
            <li>kreve seier (🎉) og erklære at a er fullført</li>
          </ul>
        </div>
        <div className={classes.version}>
          Versjon
          <code>{import.meta.env.VITE_RELEASE ?? "development"}</code>
        </div>
      </Modal>
    </>
  );
};
