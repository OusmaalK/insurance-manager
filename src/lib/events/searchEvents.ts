// src/lib/events/searchEvents.ts
// Event bus pour la recherche - PAS de props fonctions
type SearchCallback = (search: string) => void;

let searchCallback: SearchCallback | null = null;

export const registerSearchCallback = (callback: SearchCallback) => {
  searchCallback = callback;
};

export const triggerSearch = (search: string) => {
  if (searchCallback) {
    searchCallback(search);
  }
};

export const clearSearchCallback = () => {
  searchCallback = null;
};