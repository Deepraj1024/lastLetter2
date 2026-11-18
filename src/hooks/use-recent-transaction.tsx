import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { baseApi } from '@/services/apis';
import type { TransactionParamsSchema } from '@/services/schema/recent-transaction';

// Hook for standard query (used on Dashboard to fetch top items)
export const useRecentTransaction = (props: {
  month?: number;
  name?: string;
  year: number;
}) => {
  const cleanQuery = useMemo(() => {
    const query: { year: number; month?: number; name?: string } = {
      year: props.year,
    };

    if (typeof props.month === 'number' && !Number.isNaN(props.month)) {
      query.month = props.month;
    }

    if (props.name && props.name.trim() !== '') {
      query.name = props.name.trim();
    }

    return query;
  }, [props.month, props.name, props.year]);

  return useQuery({
    queryFn: async () => {
      try {
        const response = await baseApi('/recent-transactions', {
          method: 'GET',
          query: cleanQuery as TransactionParamsSchema,
        });
        return response.data;
      } catch (error) {
        console.error('❌ [GET /recent-transactions] Request failed:', error);
        throw error;
      }
    },
    queryKey: ['recent-transactions', cleanQuery],
  });
};

// Hook for Infinite Scroll Pagination (used on Transactions List page)
export const useRecentTransactionInfinite = (props: {
  month?: number;
  name?: string;
  year: number;
  limit?: number;
}) => {
  const { limit = 10 } = props;

  const cleanQuery = useMemo(() => {
    const query: {
      year: number;
      month?: number;
      name?: string;
      limit: number;
    } = {
      limit,
      year: props.year,
    };

    if (typeof props.month === 'number' && !Number.isNaN(props.month)) {
      query.month = props.month;
    }

    if (props.name && props.name.trim() !== '') {
      query.name = props.name.trim();
    }

    return query;
  }, [props.month, props.name, props.year, limit]);

  return useInfiniteQuery({
    getNextPageParam: (lastPage, allPages) => {
      // If server returns fewer items than the limit, we have reached the last page
      const currentLength = lastPage?.data?.length ?? 0;
      if (currentLength < limit) {
        return;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await baseApi('/recent-transactions', {
          method: 'GET',
          query: {
            ...cleanQuery,
            page: pageParam,
          },
        });
        return response.data;
      } catch (error) {
        console.error(
          '❌ [GET /recent-transactions Infinite] Request failed:',
          error
        );
        throw error;
      }
    },
    queryKey: ['recent-transactions-infinite', cleanQuery],
  });
};
