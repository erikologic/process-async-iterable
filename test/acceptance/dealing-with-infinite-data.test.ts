import { finallyDo } from "../../src/consumers/finally-do";
import { filterTypeSafe } from "../../src/transformers/filter";
import { map } from "../../src/transformers/map";

describe("dealing with infinite data", () => {
  test("a generic example", async () => {
    const potentiallyInfiniteNumber = 1_000_000;
    async function* anInfiniteDataSource() {
      for (let i = 1; i <= potentiallyInfiniteNumber; i++) {
        yield i;
      }
    }

    const addOne = map((x: number) => x + 1);

    const finalDataSink = jest.fn();
    const sendToFinalSink = finallyDo(async (x: number) => finalDataSink(x));

    const results = await sendToFinalSink(addOne(anInfiniteDataSource()));

    expect(results).toEqual(undefined);
    expect(finalDataSink).toHaveBeenCalledTimes(potentiallyInfiniteNumber);
  });

  test("let's get rich fast", async () => {
    async function* btcFeed() {
      const potentiallyInfiniteNumber = 1_000_000;
      for (let i = 1; i <= potentiallyInfiniteNumber; i++) {
        yield Math.random() * 60_000;
      }
    }

    const shouldBuyOrSell = () => {
      let lastSignal: "buy" | "sell" | undefined;
      return (btcPrice: number) => {
        const sellThreshold = 50_000;
        if (btcPrice > sellThreshold && lastSignal !== "sell") {
          lastSignal = "sell";
          return "sell";
        }

        const buyThreshold = 35_000;
        if (btcPrice < buyThreshold && lastSignal !== "buy") {
          lastSignal = "buy";
          return "buy";
        }
      };
    };
    const raiseSignal = map(shouldBuyOrSell());

    const isBuySell = (
      signal: "buy" | "sell" | undefined
    ): signal is "buy" | "sell" => !!signal;
    const filterDoNothing = filterTypeSafe(isBuySell);

    const putBtcOrder = jest.fn();
    const callCryptoBrokerApi = finallyDo(async (signal: "buy" | "sell") =>
      putBtcOrder(signal)
    );

    await callCryptoBrokerApi(filterDoNothing(raiseSignal(btcFeed())));

    const callsToMock = putBtcOrder.mock.calls.length;
    expect(callsToMock).toBeGreaterThanOrEqual(10_000);
    const buySignals = putBtcOrder.mock.calls.filter(
      ([signal]) => signal === "buy"
    ).length;
    expect(buySignals).toBeGreaterThanOrEqual(100);
    const sellSignals = putBtcOrder.mock.calls.filter(
      ([signal]) => signal === "sell"
    ).length;
    expect(sellSignals).toBeGreaterThanOrEqual(100);
  });
});
