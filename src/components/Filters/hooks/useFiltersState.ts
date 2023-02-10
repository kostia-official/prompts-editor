import { useState, useCallback, useMemo } from 'react';
import { TagObject, ImagePrompts } from '../../../types';

export interface FiltersState {
  isOnlyEmptyPrompts: boolean;
  tagsFilter: TagObject[];
}

export type UpdateFilters = (filters: FiltersState) => void;

export const useFiltersState = () => {
  const [tagsFilter, setTagsFilter] = useState<TagObject[]>([]);
  const [isOnlyEmptyPrompts, setIsOnlyEmptyPrompts] = useState(false);

  const updateFilters: UpdateFilters = useCallback((filters) => {
    setTagsFilter(filters.tagsFilter);
    setIsOnlyEmptyPrompts(filters.isOnlyEmptyPrompts);
  }, []);

  const filters = useMemo(() => {
    return { tagsFilter, isOnlyEmptyPrompts };
  }, [isOnlyEmptyPrompts, tagsFilter]);

  const getFilteredImagesPrompts = useCallback(
    (imagesPrompts: ImagePrompts[] | undefined, currentFilters: FiltersState = filters) => {
      const { isOnlyEmptyPrompts, tagsFilter } = currentFilters;

      if (!imagesPrompts) return [];
      if (!tagsFilter.length && !isOnlyEmptyPrompts) return imagesPrompts;

      return imagesPrompts.filter((item) => {
        if (isOnlyEmptyPrompts) return !item.promptsString;
        if (!item.promptsString) return false;

        const promptsTags = item.promptsString.split(',').map((p) => p.trim());
        return tagsFilter.every(({ tag }) => promptsTags.includes(tag));
      });
    },
    [filters]
  );

  return {
    filters,
    updateFilters,
    getFilteredImagesPrompts,
  };
};
