import {
  fromFiles,
  FromFilesProps,
  toFiles,
  ToFilesProps,
} from "../../src/cache";
import { consume, finallyDo } from "../../src/consumers";
import { fromIterable } from "../../src/producers";

interface Message {
  id: number;
  type: string;
  payload: unknown;
}

describe("caching data", () => {
  test("messages can be cached and reloaded", async () => {
    const message1: Message = {
      id: 1,
      type: "some-message",
      payload: { hey: "you" },
    };
    const message2: Message = {
      id: 2,
      type: "another-message",
      payload: { whats: "up" },
    };
    const message3: Message = {
      id: 3,
      type: "last-message",
      payload: { alright: "m8" },
    };
    const source = fromIterable([message1, message2, message3]);

    const fileOpts: FromFilesProps | ToFilesProps<Message> = {
      dir: "tmp",
      getFilename: (message) => `${message.id}-${message.type}`,
    };
    const messageToFile = finallyDo(toFiles(fileOpts));

    await messageToFile(source);

    const res = await consume(fromFiles<Message>(fileOpts));
    const sorted = res.sort((a, b) => a.id - b.id);
    expect(sorted).toEqual([message1, message2, message3]);
  });
});
