import { useSearchParams } from "react-router";
import {  FILTER_SCHEMA, type FilterValues } from "../utils";
import superjson from "superjson";

const FILTER_PROPERTY_NAME_IN_PARAMS = "filter";

export function useFilterSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getFilterParams = (): Partial<FilterValues> | null => {
    const params = searchParams.get(FILTER_PROPERTY_NAME_IN_PARAMS);
    if (!params) return null;
    try {
      const parsed = superjson.parse(params);
      return FILTER_SCHEMA.partial().parse(parsed);
    } catch {
      return null;
    }
  };

  const setFilterParams = (values: Partial<FilterValues>) => {
    const validated = FILTER_SCHEMA.partial().safeParse(values);
    if (!validated.success) return;

    const newParams = new URLSearchParams(searchParams);
    newParams.set(
      FILTER_PROPERTY_NAME_IN_PARAMS,
      superjson.stringify(validated.data)
    );
    setSearchParams(newParams);
  };

  return [getFilterParams(), setFilterParams] as const;
}
