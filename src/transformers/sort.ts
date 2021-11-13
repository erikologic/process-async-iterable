type SortFn<TPayload> = (a: TPayload, b: TPayload) => number;

export const sort = <TPayload>(sortFn: SortFn<TPayload>) =>
  async function* (
    iterable: AsyncIterable<TPayload[]>
  ): AsyncIterable<TPayload[]> {
    for await (const payload of iterable) {
      yield payload.sort(sortFn);
    }
  };
