type FinalStepFn<TPayload> = (payload: TPayload) => Promise<void>;

export const finallyDo = <TPayload>(finalStepFn: FinalStepFn<TPayload>) =>
  async function (iterable: AsyncIterable<TPayload>) {
    for await (const el of iterable) {
      await finalStepFn(el);
    }
  };
