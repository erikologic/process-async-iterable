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

export type MatchTypeSafeFn<TUnfiltered, TFiltered extends TUnfiltered> = (
  payload: TUnfiltered
) => payload is TFiltered;

// TODO would be nice if this was just an overload on `filter`
export const filterTypeSafe = <TPayloadIn, TPayloadOut extends TPayloadIn>(
  match: MatchTypeSafeFn<TPayloadIn, TPayloadOut>
) =>
  async function* (
    iterable: AsyncIterable<TPayloadIn>
  ): AsyncIterable<TPayloadOut> {
    for await (const payload of iterable) {
      if (match(payload)) yield payload;
    }
  };
