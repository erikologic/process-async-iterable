import { consume } from "../../src/consumers";
import { fromIterable } from "../../src/producers";
import { filter, map } from "../../src/transformers";

test("chains can be reused", async () => {
  const add3 = map((x: number) => x + 3);
  const filterEven = filter((x: number) => x % 2 === 0);
  const add3AndFilterEven = (source: AsyncIterable<number>) =>
    consume(filterEven(add3(source)));

  const array1 = [1, 2, 3, 4];
  const source1 = fromIterable(array1);
  const results1 = await add3AndFilterEven(source1);
  const expectation1 = [4, 6];
  expect(results1).toEqual(expectation1);

  const array2 = [21, 22, 23, 24];
  const source2 = fromIterable(array2);
  const results2 = await add3AndFilterEven(source2);
  const expectation2 = [24, 26];
  expect(results2).toEqual(expectation2);
});
