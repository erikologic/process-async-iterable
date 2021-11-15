export type RecursiveFn<TValue> = () => Promise<{
  value: TValue;
  done: boolean;
  next?: RecursiveFn<TValue>;
}>;

export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export async function* fromRecursiveFn<TValue>(
  recursiveFn: RecursiveFn<TValue>
): AsyncIterable<TValue> {
  let res: Awaited<ReturnType<RecursiveFn<TValue>>>;
  let next: typeof res["next"] = recursiveFn;
  do {
    if (!next) return;
    res = await next();
    yield res.value;
    next = res.next;
  } while (!res.done || next);
}
