// src/components/admin/shared/DataTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Table } from '@/shared/ui/Table';
import { SearchBar } from './SearchBar';
import { PaginationWrapper } from '../../../components/admin/shared/PaginationWrapper';
import { registerSearchCallback, triggerSearch } from '@/lib/events/searchEvents';
import { registerPageChangeCallback, registerPageSizeChangeCallback, triggerPageChange, triggerPageSizeChange } from '@/lib/events/paginationEvents';

interface Column<T = any> {
  key: string;
  header: string;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  totalItems: number;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  onSearch?: (search: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  searchPlaceholder?: string;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  totalItems,
  isLoading = false,
  onRowClick,
  onSearch,
  onPageChange,
  onPageSizeChange,
  searchPlaceholder = 'Rechercher...'
}: DataTableProps<T>) => {
  // Enregistrer les callbacks du parent au montage
  useEffect(() => {
    if (onSearch) {
      registerSearchCallback(onSearch);
    }
    if (onPageChange) {
      registerPageChangeCallback(onPageChange);
    }
    if (onPageSizeChange) {
      registerPageSizeChangeCallback(onPageSizeChange);
    }
    
    // Nettoyer les callbacks au démontage
    return () => {
      // Optionnel: nettoyer les callbacks
    };
  }, [onSearch, onPageChange, onPageSizeChange]);

  return (
    <div className="space-y-4">
      {/* Barre de recherche */}
      {onSearch && <SearchBar placeholder={searchPlaceholder} />}

      {/* Tableau */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          onRowClick={onRowClick}
          emptyMessage="Aucune donnée"
        />
      </div>

      {/* Pagination */}
      {totalItems > 0 && <PaginationWrapper totalItems={totalItems} />}
    </div>
  );
};

export default DataTable;