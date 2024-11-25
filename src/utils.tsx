export const neverGuard = <T,>(_: never, def: T) => {
  return def;
};
