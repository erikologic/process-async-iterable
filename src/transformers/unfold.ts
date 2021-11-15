export async function* unfold<TPayload>(
  iterable: AsyncIterable<TPayload[]>
): AsyncIterable<TPayload> {
  for await (const array of iterable) {
    for (const el of array) {
      yield el;
    }
  }
}
