export async function* fromIterable<TPayload>(
  iterable: Iterable<TPayload>
): AsyncIterable<TPayload> {
  for (const elem of iterable) yield elem;
}
