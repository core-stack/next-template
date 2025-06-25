import { ApiPath } from '@packages/common';
import { useQueryClient } from '@tanstack/react-query';

export const useApiInvalidate = () => {
  const queryClient = useQueryClient();
  return (...queryKey: ApiPath[]) => queryClient.invalidateQueries({ queryKey: queryKey });
}