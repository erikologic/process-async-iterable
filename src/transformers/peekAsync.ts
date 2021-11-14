type AsyncPeakFn<TPayload> = (payload: TPayload) => Promise<void>;

export const peekAsync = <TPayload>(peakFn: AsyncPeakFn<TPayload>) =>
  async function* (iterable: AsyncIterable<TPayload>): AsyncIterable<TPayload> {
    for await (const payload of iterable) {
      await peakFn(payload);
      yield payload;
    }
  };
