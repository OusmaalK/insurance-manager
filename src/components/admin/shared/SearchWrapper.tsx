// src/components/admin/shared/PaginationBar.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Pagination } from '@/shared/ui/Table';
import { 
  registerPageChangeCallback, 
  registerPageSizeChangeCallback,
  triggerPageChange,
  triggerPageSizeChange
} from '@/lib/events/paginationEvents';

interface PaginationBarProps {
  totalItems: number;
  initialPageSize?: number;
}

export const PaginationBar = ({ totalItems, initialPageSize = 10 }: PaginationBarProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.ceil(totalItems / pageSize);

  // Enregistrer les callbacks au montage - PAS de props fonctions
  useEffect(() => {
    registerPageChangeCallback((page: number) => {
      setCurrentPage(page);
    });
    registerPageSizeChangeCallback((size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    triggerPageChange(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    triggerPageSizeChange(size);
  };

  if (totalItems === 0) return null;

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