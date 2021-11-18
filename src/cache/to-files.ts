import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

export interface ToFilesProps<TPayload> {
  dir: string;
  getFilename: (payload: TPayload) => string;
}

export const toFiles = <TPayload>({
  dir,
  getFilename,
}: ToFilesProps<TPayload>) => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  return async (payload: TPayload) => {
    const filename = `${dir}/${getFilename(payload)}`;
    const data = JSON.stringify(payload, null, 4);
    await writeFile(filename, data);
  };
};
