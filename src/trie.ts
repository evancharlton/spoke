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

/**
 * Walk the trie along the path specified by current, returning the first word
 * that is found along the way.
 *
 * If impossible input is given, an error will be thrown.
 *
 * @returns the first word found, or undefined if a word is not yet formed
 */
export const firstWord = (trie: Trie, current: string): string | undefined => {
  let node: Trie | undefined = trie;
  for (let i = 0; i < current.length; i += 1) {
    if (node?._?.length) {
      return node._[0];
    }

    if (!node) {
      throw new Error("Impossible situation");
    }

    node = node[current[i] as Letter];
  }
  return undefined;
};

export const possibleWord = (
  trie: Trie,
  current: string
): string | undefined => {
  let node = walk(trie, current);
  if (!node) {
    return undefined;
  }

  // Continue walking to find the first possible word.
  while (node) {
    if (node?._?.length) {
      return node?._[0];
    }

    const option: Letter | undefined = nodeOptions(node)[0];
    if (!option) {
      throw new Error("No word can be formed -- this should be impossible");
    }

    node = node[option];
  }
  return undefined;
};

export const findAlternate = (trie: Trie, current: string) => {
  let node: Trie | undefined = trie;
  for (let i = 0; i < current.length; i += 1) {
    if (node?._?.length) {
      // This shouldn't really be possible, but .. whatever.
      return node._[0];
    }

    if (!node) {
      throw new Error("Impossible: we walked off the trie too early");
    }

    const next: Trie | undefined = node[current[i] as Letter];
    if (!next) {
      // We found where current walks off the trie and into fantasy land. At
      // this point we should break so that we can resume the search and find
      // the first possible word.
      break;
    }

    // Otherwise, keep walking deeper into the trie.
    node = next;
  }

  // At this point, we have branched off from current. Let's just walk until we
  // find a word.
  //
  // For now, we're going to use the first alphabetic word, but it'd be fun
  // later to walk randomly, to return different words :)
  while (true) {
    if (!node) {
      throw new Error("Impossible: we walked off the trie");
    }

    if (node._?.length) {
      return node._[0];
    }

    const options = nodeOptions(node);
    const choice = options[0];
    if (!choice) {
      throw new Error("Impossible: we into a dead end!");
    }
    node = node[choice];
  }

  // That's an infinite loop, so this is never reached.
};

export const nodeOptions = (trie: Trie): Letter[] => {
  return Object.keys(trie).filter((v) => v !== "_") as Letter[];
};
