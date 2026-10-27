export function createStore(initial = {}) {
  let state = {
    t: 0,
    target: 0,
    playing: false,
    speed: 1,
    selected: null,
    hover: null,
    xray: false,
    status: "ASSEMBLED",
    hidden: new Set(),
    ...initial,
  };
  const listeners = new Set();
  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...patch };
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => listeners.delete(fn);
    },
  };
}
