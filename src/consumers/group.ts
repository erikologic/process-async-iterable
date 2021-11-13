type GetGroupingKey<TPayload> = (payload: TPayload) => string;
type Grouped<TPayload> = { [id: string]: TPayload[] };

export const group = <TPayload>(getGroupingKey: GetGroupingKey<TPayload>) =>
  async function (
    iterable: AsyncIterable<TPayload>
  ): Promise<Grouped<TPayload>> {
    const groups: { [id: string]: TPayload[] } = {};

    for await (const payload of iterable) {
      const id = getGroupingKey(payload);
      groups[id] = (groups[id] || []).concat(payload);
    }

    return groups;
  };
