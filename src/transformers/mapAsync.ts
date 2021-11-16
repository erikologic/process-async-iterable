type AsyncMapFn<TPayloadIn, TPayloadOut> = (
  payload: TPayloadIn
) => Promise<TPayloadOut>;

export const mapAsync = <TPayloadIn, TPayloadOut>(
  mapFn: AsyncMapFn<TPayloadIn, TPayloadOut>
) =>
  async function* (
    iterable: AsyncIterable<TPayloadIn>
  ): AsyncIterable<TPayloadOut> {
    for await (const payload of iterable) {
      yield await mapFn(payload);
    }
  };
