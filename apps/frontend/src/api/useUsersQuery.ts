import { useQuery } from '@tanstack/react-query';
import apiRoutes from '@/api/apiRoutes';

import type { TUser } from '@/components/UserItem';

/**
 * useUsersQuery
 * Manage API data with Tanstack react-query
 */

export function useUsersQuery() {
  const fetchUsers = () =>
    useQuery({
      queryKey: ['users'],
      queryFn: async (): Promise<TUser[]> => {
        const response = await fetch(apiRoutes.users);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }
    });

  return { fetchUsers };
}
