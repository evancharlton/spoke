import { useState, ComponentProps } from "react";
import {
  MdOutlineAutorenew,
  MdOutlineLink,
  MdOutlineSettings,
  MdOutlineInfo,
} from "react-icons/md";
import { useParams, useHref, NavLink, useNavigate } from "react-router";
import {
  HamburgerMenu,
  Action,
  Content,
} from "../../spa-components/HamburgerMenu";
import { OtherApps } from "../../spa-components/HamburgerMenu/OtherApps";
import { Modal } from "../../spa-components/Modal";
import { ShareDialog } from "../../spa-components/ShareDialog";
import settingsClasses from "./SettingsDialog.module.css";
import { useNewGame } from "../GameLogic/context";

const mot = (n: number) => {
  if (n === 1) {
    return "motstander";
  }
  return "motstandere";
};

export const Hamburger = () => {
  const [dialog, setDialog] = useState<
    "hamburger" | "settings" | "about" | "share" | undefined
  >(undefined);

  const { lang, opponentId = "?" } = useParams();
  const href = useHref(`/${lang}/${opponentId}`);
  const url = `${location.protocol}//${location.host}/${href}`;
  const navigate = useNavigate();
  const newGame = useNewGame();

  const shareText = `Jeg spiller Spøke mot ${opponentId?.length} ${mot(opponentId?.length)}!`;

  return (
    <>
      <HamburgerMenu
        open={dialog === "hamburger"}
        onOpen={() => setDialog("hamburger")}
        onClose={() => setDialog((v) => (v === "hamburger" ? undefined : v))}
      >
        <Action
          icon={MdOutlineAutorenew}
          text="Omkamp"
          onClick={() => {
            setDialog(undefined);
            newGame();
          }}
        />
        <Action
          icon={MdOutlineLink}
          text="Del spill"
          onClick={() => setDialog("share")}
        />
        <Content />
        <Action
          icon={MdOutlineAutorenew}
          text="Ny kamp"
          onClick={() => {
            setDialog(undefined);
            navigate(`/${lang}`, { replace: true });
          }}
        />
        <Action
          icon={MdOutlineSettings}
          text="Instillinger"
          onClick={() => setDialog("settings")}
        />
        <Action
          icon={MdOutlineInfo}
          text="Om Spøke"
          onClick={() => setDialog("about")}
        />
        <OtherApps />
      </HamburgerMenu>
      <ShareDialog
        shareText={shareText}
        dialogText="Del dette spillet med en venn:"
        url={url}
        open={dialog === "share"}
        onClose={() => setDialog((v) => (v === "share" ? undefined : v))}
      />
      <AboutDialog
        open={dialog === "about"}
        onClose={() => setDialog((v) => (v === "about" ? undefined : v))}
      />
      <SettingsDialog
        open={dialog === "settings"}
        onClose={() => setDialog((v) => (v === "settings" ? undefined : v))}
      />
    </>
  );
};

const SettingsDialog = (
  props: Pick<ComponentProps<typeof Modal>, "open" | "onClose">,
) => {
  return (
    <Modal title="Instillinger" {...props}>
      <h3 className={settingsClasses.title}>Språk</h3>
      <div className={settingsClasses.languages}>
        <NavLink
          className={({ isActive }) =>
            isActive ? settingsClasses.active : undefined
          }
          replace
          to="/nb"
        >
          bokmål
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? settingsClasses.active : undefined
          }
          replace
          to="/nn"
        >
          nynorsk
        </NavLink>
      </div>
    </Modal>
  );
};

const AboutDialog = (
  props: Pick<ComponentProps<typeof Modal>, "open" | "onClose">,
) => {
  return (
    <Modal title="Om Spøke" {...props}>
      <p>
        <strong>Spøke</strong> er et norsk ordspill for å lære norsk (og ha litt
        moro).
      </p>
      <p>
        Dette spillet er et program fra{" "}
        <a href="https://evancharlton.com" target="_blank">
          Evan Charlton
        </a>{" "}
        og er helt gratis å spille!
      </p>
      <p>
        Spørsmål?{" "}
        <a href="mailto:evancharlton@gmail.com?subject=Spoke">
          evancharlton@gmail.com
        </a>
      </p>
    </Modal>
  );
};
