export type AsyncMatchFn<TPayload> = (payload: TPayload) => Promise<boolean>;

export const filterAsync = <TPayload>(match: AsyncMatchFn<TPayload>) =>
  async function* (iterable: AsyncIterable<TPayload>): AsyncIterable<TPayload> {
    for await (const payload of iterable) {
      if (await match(payload)) yield payload;
    }
  };

export const notAsync =
  <TPayload>(match: AsyncMatchFn<TPayload>) =>
  async (payload: TPayload) =>
    !(await match(payload));
