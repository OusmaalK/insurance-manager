// src/components/admin/shared/PaginationWrapper.tsx
'use client';

import React from 'react';
import { Pagination } from '@/shared/ui/Table';
import { usePaginationStore } from '@/stores/paginationStore';

interface PaginationWrapperProps {
  totalItems: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const PaginationWrapper = ({ 
  totalItems, 
  onPageChange, 
  onPageSizeChange 
}: PaginationWrapperProps) => {
  const { currentPage, pageSize, setPage, setPageSize } = usePaginationStore();
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setPage(page);
    if (onPageChange) onPageChange(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    if (onPageSizeChange) onPageSizeChange(size);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  );
};