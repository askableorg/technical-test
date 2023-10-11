import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiRoutes from '@/api/apiRoutes';
import type { Product } from '@/pages/products/ProductPage';

/**
 * useOrdersQuery
 * Manage API data with Tanstack react-query
 */

type Order = {
  _id: string;
  created_at: string;
  product_id: string;
  product?: Product;
};

export function useOrdersQuery() {
  const queryClient = useQueryClient();

  const fetchOrders = () =>
    useQuery({
      queryKey: ['orders'],
      queryFn: async (): Promise<Order[]> => {
        const response = await fetch(apiRoutes.orders);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }
    });

  const addOrder = () =>
    useMutation({
      mutationFn: async (productId: string) => {
        const response = await fetch(apiRoutes.order, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: productId })
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    });

  return { fetchOrders, addOrder };
}
