type Mapper<TPayloadIn, TPayloadOut> = (payload: TPayloadIn) => TPayloadOut;

export const map = <TPayloadIn, TPayloadOut>(
  mapper: Mapper<TPayloadIn, TPayloadOut>
) =>
  async function* (
    iterable: AsyncIterable<TPayloadIn>
  ): AsyncIterable<TPayloadOut> {
    for await (const payload of iterable) {
      yield mapper(payload);
    }
  };
