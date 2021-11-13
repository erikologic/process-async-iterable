export async function consume<TPayload>(
  iterable: AsyncIterable<TPayload>
): Promise<TPayload[]> {
  const collection: TPayload[] = [];

  for await (const payload of iterable) {
    collection.push(payload);
  }

  return collection;
}
