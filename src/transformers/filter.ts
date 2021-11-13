export type MatchFn<TPayload> = (payload: TPayload) => boolean;

export const filter = <TPayload>(match: MatchFn<TPayload>) =>
  async function* (iterable: AsyncIterable<TPayload>): AsyncIterable<TPayload> {
    for await (const payload of iterable) {
      if (match(payload)) yield payload;
    }
  };

export const not =
  <TPayload>(match: MatchFn<TPayload>) =>
  (payload: TPayload) =>
    !match(payload);
