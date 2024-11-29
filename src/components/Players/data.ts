import { Bluffer } from "./Bluffer";
import { Challenger } from "./Challenger";
import { HumanPlayer } from "./HumanPlayer";
import { RandomPlayer, RandomPlayer2 } from "./RandomPlayer";
import { SoreLoser } from "./SoreLoser";

type PlayerSpec = {
  impl: () => React.ReactNode;
  name: string;
  icon: React.ReactNode;
  description: React.ReactNode;
  unpickable?: true;
};

export const PLAYERS: Record<string, PlayerSpec> = {
  human: {
    unpickable: true,
    impl: HumanPlayer,
    name: "Du",
    icon: "",
    description: "",
  },
  r: {
    impl: RandomPlayer,
    name: "Tilfeldig",
    icon: "🎲",
    description:
      "Velger en gyldig bokstav tilfeldig, men vil ikke innrømme nederlag før konfrontert.",
  },
  t: {
    impl: RandomPlayer2,
    name: "Ærlig",
    icon: "🎩",
    description: "Velger en gyldig bokstav tilfeldig. Vil innrømme å tape.",
  },
  b: {
    impl: Bluffer,
    name: "Bløffmaker",
    icon: "🤥",
    description: "Løgn, utfordringer eller skuespill — er uforutsigbar!",
  },
  s: {
    impl: SoreLoser,
    name: "Gretten",
    icon: "😈",
    description: "Foretrekker å lyve fremfor å tape.",
  },
  c: {
    impl: Challenger,
    name: "Utforder",
    icon: "🧐",
    description: "Vil utfordre deg før du innrømmer tap.",
  },
} as const;
