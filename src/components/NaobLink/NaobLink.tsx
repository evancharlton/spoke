export const NaobLink = ({ word }: { word: string }) => {
  return (
    <a
      href={`https://naob.no/s%C3%B8k?q=${word}`}
      target="naob"
      rel="noopener nofollower noreferer"
    >
      {word}
    </a>
  );
};
