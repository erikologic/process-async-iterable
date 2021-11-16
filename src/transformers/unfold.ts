export async function* unfold<TPayload>(
  iterable: AsyncIterable<TPayload[]>
): AsyncIterable<TPayload> {
  for await (const array of iterable) {
    for (const payload of array) {
      yield payload;
    }
  }
}
