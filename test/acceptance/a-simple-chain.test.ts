import { consume } from "../../src/consumers";
import { fromIterable } from "../../src/producers";
import { map } from "../../src/transformers";

describe("a simple case", () => {
  test("can sum numbers", async () => {
    async function* getNumbers() {
      yield 1;
      yield 2;
      yield 3;
    }

    const addOne = map((x: number) => x + 1);

    const spy = jest.fn();

    for await (const n of addOne(getNumbers())) {
      spy(n);
    }
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledWith(3);
    expect(spy).toHaveBeenCalledWith(4);
  });

  test("a nicer version", async () => {
    const anArray = [1, 2, 3];

    const source = fromIterable(anArray);
    const addOne = map((x: number) => x + 1);
    const results = await consume(addOne(source));

    const expectation = [2, 3, 4];
    expect(results).toEqual(expectation);
  });
});
