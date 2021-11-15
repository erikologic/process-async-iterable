import { readdir, readFile } from "fs/promises";

export interface FromFilesProps {
  dir: string;
}

export async function* fromFiles<TPayload>({
  dir,
}: FromFilesProps): AsyncIterable<TPayload> {
  const files = await readdir(`${dir}/`);

  for (const file of files) {
    const string = await readFile(`${dir}/${file}`, "utf-8");
    yield JSON.parse(string) as TPayload;
  }
}
