import { useApiQuery } from './use-api-query';

export const useUser = () => {
  return useApiQuery("[GET] /api/user/self");
}