export type Trie = {
  a?: Trie;
  b?: Trie;
  c?: Trie;
  d?: Trie;
  e?: Trie;
  f?: Trie;
  g?: Trie;
  h?: Trie;
  i?: Trie;
  j?: Trie;
  k?: Trie;
  l?: Trie;
  m?: Trie;
  n?: Trie;
  o?: Trie;
  p?: Trie;
  q?: Trie;
  r?: Trie;
  s?: Trie;
  t?: Trie;
  u?: Trie;
  v?: Trie;
  w?: Trie;
  x?: Trie;
  y?: Trie;
  z?: Trie;
  æ?: Trie;
  ø?: Trie;
  å?: Trie;

  _?: string[];
};

export type Letter = keyof Omit<Trie, "_">;

export const walk = (trie: Trie, current: string): Trie | undefined => {
  let node: Trie | undefined = trie;
  for (let i = 0; i < current.length; i += 1) {
    if (!node) {
      return undefined;
    }
    node = node[current[i] as Letter];
  }
  return node;
};

export const nodeOptions = (trie: Trie): Letter[] => {
  return Object.keys(trie).filter((v) => v !== "_") as Letter[];
};
