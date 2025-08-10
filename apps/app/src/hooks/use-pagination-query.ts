import { parseAsInteger, useQueryState, useQueryStates } from "nuqs";

export function usePaginationQuery() {
  const [{ pageIndex, pageSize }, setQuery] = useQueryStates(
    {
      pageIndex: parseAsInteger.withDefault(0),
      pageSize: parseAsInteger.withDefault(10),
    },
    {
      shallow: false,
    },
  );

  return {
    pageIndex,
    pageSize,
    setPageIndex: (n: number) => setQuery({ pageIndex: n }),
    setPageSize: (n: number) => setQuery({ pageSize: n }),
  };
}
