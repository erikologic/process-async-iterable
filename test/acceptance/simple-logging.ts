import { consume } from "../../src/consumers/consume";
import { simpleLogger } from "../../src/loggers/simple-logger";
import { fromIterable } from "../../src/producers/from-iterable";
import { peek } from "../../src/transformers/peek";

describe("simple logger", () => {
  const consoleLogSpy = jest.spyOn(console, "log");

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("logs strings", async () => {
    await consume(peek(simpleLogger)(fromIterable(["hello", "world"])));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("hello")
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("world")
    );
  });

  test("logs objects", async () => {
    await consume(
      peek(simpleLogger)(
        fromIterable([{ hello: "world" }, { iAm: "a working logger" }])
      )
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('"hello": "world"')
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('"iAm": "a working logger"')
    );
  });
});
