type GroupingKeyFn<TPayload> = (payload: TPayload) => string;
type Grouped<TPayload> = { [id: string]: TPayload[] };

export const group = <TPayload>(groupingKeyFn: GroupingKeyFn<TPayload>) =>
  async function (
    iterable: AsyncIterable<TPayload>
  ): Promise<Grouped<TPayload>> {
    const groups: { [id: string]: TPayload[] } = {};

    for await (const payload of iterable) {
      const id = groupingKeyFn(payload);
      groups[id] = (groups[id] || []).concat(payload);
    }

    return groups;
  };
