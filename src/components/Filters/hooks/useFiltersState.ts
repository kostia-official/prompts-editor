import { useCallback, useMemo } from 'react';
import { TagObject, ImagePrompts } from '../../../types';
import { cleanBrackets, getImageSize } from '../../../utils';
import { useLocalStorageState } from '../../../hooks/useLocalStorageState';

export interface HookArgs {
  key: string;
}

export interface FiltersState {
  tagsFilter: TagObject[];
  isOnlyEmptyPrompts: boolean;
  isKeepUnsaved: boolean;
  isUncropped: boolean;
}

export type UpdateFilters = (filters: FiltersState) => void;

export const useFiltersState = ({ key }: HookArgs) => {
  const [tagsFilter, setTagsFilter] = useLocalStorageState<TagObject[]>(`${key}/tagsFilter`, []);
  const [isOnlyEmptyPrompts, setIsOnlyEmptyPrompts] = useLocalStorageState(
    `${key}/isOnlyEmptyPrompts`,
    false
  );
  const [isKeepUnsaved, setIsKeepUnsaved] = useLocalStorageState(`${key}/isKeepUnsaved`, true);
  const [isUncropped, setIsUncropped] = useLocalStorageState(`${key}/isUncropped`, false);

  const updateFilters: UpdateFilters = useCallback(
    (filters) => {
      setTagsFilter(filters.tagsFilter);
      setIsOnlyEmptyPrompts(filters.isOnlyEmptyPrompts);
      setIsKeepUnsaved(filters.isKeepUnsaved);
      setIsUncropped(filters.isUncropped);
    },
    [setIsKeepUnsaved, setIsOnlyEmptyPrompts, setIsUncropped, setTagsFilter]
  );

  const filters = useMemo(() => {
    return { tagsFilter, isOnlyEmptyPrompts, isKeepUnsaved, isUncropped };
  }, [isOnlyEmptyPrompts, tagsFilter, isKeepUnsaved, isUncropped]);

  const getFilteredImagesPrompts = useCallback(
    async (imagesPrompts: ImagePrompts[] | undefined, currentFilters: FiltersState = filters) => {
      const { isOnlyEmptyPrompts, tagsFilter, isKeepUnsaved, isUncropped } = currentFilters;

      if (!imagesPrompts) return [];

      const imagesToCrop: string[] = [];

      if (isUncropped) {
        for (const item of imagesPrompts) {
          try {
            const imageSize = await getImageSize(item.imageFile);
            if (imageSize.width !== 512 && imageSize.height !== 512) {
              imagesToCrop.push(item.name);
            }
          } catch (err) {
            console.error('error getting image size', err);
            imagesToCrop.push(item.name);
          }
        }
      }

      return imagesPrompts.filter((item) => {
        if (isKeepUnsaved && !item.isSaved) return true; // should be the first
        if (isUncropped && !imagesToCrop.includes(item.name)) return false;
        if (isOnlyEmptyPrompts) return !item.promptsString;
        if (!item.promptsString) return false;

        const promptsTags = item.promptsString.split(',').map((p) => cleanBrackets(p.trim()));
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
