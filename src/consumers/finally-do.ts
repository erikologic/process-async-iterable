type FinallyDoFn<TPayload> = (payload: TPayload) => Promise<void>;

export const finallyDo = <TPayload>(finallyDoFn: FinallyDoFn<TPayload>) =>
  async function (iterable: AsyncIterable<TPayload>) {
    for await (const el of iterable) {
      await finallyDoFn(el);
    }
  };
