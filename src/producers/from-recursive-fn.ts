export type RecursiveFn<TPayload> = () => Promise<{
  value: TPayload;
  done: boolean;
  next?: RecursiveFn<TPayload>;
}>;

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export async function* fromRecursiveFn<TPayload>(
  recursiveFn: RecursiveFn<TPayload>
): AsyncIterable<TPayload> {
  let res: Awaited<ReturnType<RecursiveFn<TPayload>>>;
  let next: typeof res["next"] = recursiveFn;
  do {
    if (!next) return;
    res = await next();
    yield res.value;
    next = res.next;
  } while (!res.done || next);
}
