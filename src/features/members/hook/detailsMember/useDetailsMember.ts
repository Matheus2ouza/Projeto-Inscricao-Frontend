import {
  useDetailsMemberParams,
  useDetailsMemberResult,
} from "../../types/detailsMember/detailsMemberType";
import { useDetailsMemberQuery } from "./useDetailsMemberQuery";

export function useDetailsMember({
  memberId,
}: useDetailsMemberParams): useDetailsMemberResult {
  const { data, isLoading, isFetching, isFetched, error, refetch } =
    useDetailsMemberQuery(memberId);

  return {
    member: data || null,
    loading: isLoading,
    fetching: isFetching,
    fetched: isFetched,
    error: error || null,
    refresh: async () => await refetch(),
  };
}
