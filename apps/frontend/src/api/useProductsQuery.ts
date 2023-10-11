import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiRoutes from '@/api/apiRoutes';
import type { Product } from '@/pages/products/ProductPage';
import type { FormData } from '@/pages/admin/AdminAddProduct';

/**
 * useProductsQuery
 * Manage API data with Tanstack react-query
 */

export function useProductsQuery() {
  const queryClient = useQueryClient();

  const fetchProducts = (params: any) =>
    useQuery({
      queryKey: ['products'],
      queryFn: async (): Promise<Product[]> => {
        const response = await fetch(`${apiRoutes.products}?${new URLSearchParams(params)}`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }
    });

  const fetchProductById = (id?: string) =>
    useQuery({
      queryKey: ['product', id],
      queryFn: async (): Promise<Product> => {
        if (!id) {
          throw new Error('Missing ID');
        }

        const response = await fetch(`${apiRoutes.product}/${id}`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      }
    });

  const addProduct = () =>
    useMutation({
      mutationFn: async (newProduct: FormData) => {
        const response = await fetch(apiRoutes.product, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    });

  const deleteProduct = () =>
    useMutation({
      mutationFn: async (id: string) => {
        const response = await fetch(`${apiRoutes.product}/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['products'] });
      }
    });

  return { fetchProducts, fetchProductById, addProduct, deleteProduct };
}
