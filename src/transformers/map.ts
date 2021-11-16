type MapFn<TPayloadIn, TPayloadOut> = (payload: TPayloadIn) => TPayloadOut;

export const map = <TPayloadIn, TPayloadOut>(
  mapFn: MapFn<TPayloadIn, TPayloadOut>
) =>
  async function* (
    iterable: AsyncIterable<TPayloadIn>
  ): AsyncIterable<TPayloadOut> {
    for await (const payload of iterable) {
      yield mapFn(payload);
    }
  };
