export async function* fromIterable<TPayload>(
  iterable: Iterable<TPayload>
): AsyncIterable<TPayload> {
  for (const payload of iterable) yield payload;
}
