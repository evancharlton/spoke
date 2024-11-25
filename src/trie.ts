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
