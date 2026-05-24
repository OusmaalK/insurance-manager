// src/lib/events/paginationEvents.ts
type PageChangeCallback = (page: number) => void;
type PageSizeChangeCallback = (size: number) => void;

let pageChangeCallback: PageChangeCallback | null = null;
let pageSizeChangeCallback: PageSizeChangeCallback | null = null;

export const registerPageChangeCallback = (callback: PageChangeCallback) => {
  pageChangeCallback = callback;
};

export const registerPageSizeChangeCallback = (callback: PageSizeChangeCallback) => {
  pageSizeChangeCallback = callback;
};

export const triggerPageChange = (page: number) => {
  if (pageChangeCallback) {
    pageChangeCallback(page);
  }
};

export const triggerPageSizeChange = (size: number) => {
  if (pageSizeChangeCallback) {
    pageSizeChangeCallback(size);
  }
};

export const clearPaginationCallbacks = () => {
  pageChangeCallback = null;
  pageSizeChangeCallback = null;
};