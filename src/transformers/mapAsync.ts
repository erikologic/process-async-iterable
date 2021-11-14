type AsyncMapper<TPayloadIn, TPayloadOut> = (
  payload: TPayloadIn
) => Promise<TPayloadOut>;

export const mapAsync = <TPayloadIn, TPayloadOut>(
  mapper: AsyncMapper<TPayloadIn, TPayloadOut>
) =>
  async function* (
    iterable: AsyncIterable<TPayloadIn>
  ): AsyncIterable<TPayloadOut> {
    for await (const payload of iterable) {
      yield await mapper(payload);
    }
  };
