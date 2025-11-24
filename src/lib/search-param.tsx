import { useSearchParams } from "next/navigation";

export const SearchParam = (param: string): string | null => {
  const searchParams = useSearchParams();
  return searchParams?.get(param) ?? null;
};
