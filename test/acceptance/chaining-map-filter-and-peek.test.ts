import { consume } from "../../src/consumers";
import { fromIterable } from "../../src/producers";
import { filter, map, not, peek } from "../../src/transformers";

test("chaining map, filter & peek", async () => {
  const anArray = [1, 2, 3];

  const source = fromIterable(anArray);
  const addOne = map((x: number) => x + 1);
  const spyProcessing = peek((x: number) => {
    spy(x);
  });
  const filterEven = filter((x: number) => x % 2 === 0);
  const filterNot4 = filter(not((x: number) => x === 4));
  const spy = jest.fn();
  const results = await consume(
    filterNot4(filterEven(spyProcessing(addOne(source))))
  );

  const expectation = [2];
  expect(results).toEqual(expectation);

  expect(spy).toHaveBeenCalledTimes(3);
  expect(spy).toHaveBeenCalledWith(2);
  expect(spy).toHaveBeenCalledWith(3);
  expect(spy).toHaveBeenCalledWith(4);
});
