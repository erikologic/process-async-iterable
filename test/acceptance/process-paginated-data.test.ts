import { consume } from "../../src/consumers";
import { fromRecursiveFn, RecursiveFn } from "../../src/producers";

interface PagedData {
  payload: unknown;
  page: number;
  lastPage: boolean;
}
const page1: PagedData = {
  payload: {
    some: "data",
  },
  page: 1,
  lastPage: false,
};
const page2: PagedData = {
  payload: {
    other: "data",
  },
  page: 2,
  lastPage: false,
};
const page3: PagedData = {
  payload: {
    yetAnother: "data",
  },
  page: 3,
  lastPage: true,
};
const paginatedService = async ({ page }: { page: number | undefined }) => {
  return [page1, page2, page3][page || 0];
};

test("process paginated data", async () => {
  const fetchData =
    (page = 0): RecursiveFn<PagedData> =>
    async () => {
      const value = await paginatedService({
        page,
      });
      const done = value.lastPage;
      const next = done ? undefined : fetchData(page + 1);
      return { value, done, next };
    };
  const fetchPaginated = fromRecursiveFn(fetchData());

  const res = await consume(fetchPaginated);
  expect(res).toEqual([page1, page2, page3]);
});
