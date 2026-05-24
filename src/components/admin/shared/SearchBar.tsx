// src/components/admin/shared/SearchBar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { registerSearchCallback, triggerSearch } from '@/lib/events/searchEvents';

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar = ({ placeholder = 'Rechercher...' }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState('');

  // Enregistrer le callback au montage - PAS de prop fonction
  useEffect(() => {
    registerSearchCallback((search: string) => {
      // Ce callback est appelé quand la recherche est déclenchée
      setSearchValue(search);
    });
  }, []);

  const handleSearch = () => {
    triggerSearch(searchValue);
  };

  const handleClear = () => {
    setSearchValue('');
    triggerSearch('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button onClick={handleSearch} variant="primary" size="sm">
        Rechercher
      </Button>
      {searchValue && (
        <Button onClick={handleClear} variant="outline" size="sm">
          Effacer
        </Button>
      )}
    </div>
  );
};