// Minimal writable store — compatible with Svelte store contract ($store syntax).
// Zero runtime dependency on the 'svelte' package itself.

type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;

export interface Readable<T> {
  subscribe(run: Subscriber<T>): Unsubscriber;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: (value: T) => T): void;
}

export function writable<T>(initial: T): Writable<T> {
  let value = initial;
  const subscribers = new Set<Subscriber<T>>();

  return {
    subscribe(run: Subscriber<T>): Unsubscriber {
      subscribers.add(run);
      run(value);
      return () => { subscribers.delete(run); };
    },
    set(v: T): void {
      value = v;
      for (const fn of subscribers) fn(value);
    },
    update(updater: (value: T) => T): void {
      this.set(updater(value));
    },
  };
}
