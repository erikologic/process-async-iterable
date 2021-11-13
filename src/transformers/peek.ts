type PeakFn<TPayload> = (payload: TPayload) => void;

export const peek = <TPayload>(peakFn: PeakFn<TPayload>) =>
  async function* (iterable: AsyncIterable<TPayload>): AsyncIterable<TPayload> {
    for await (const payload of iterable) {
      peakFn(payload);
      yield payload;
    }
  };
