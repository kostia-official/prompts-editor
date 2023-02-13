import React, { useState, useCallback, useEffect } from 'react';
import { TagsSelect } from '../TagsSelect';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { FiltersState, UpdateFilters } from './hooks/useFiltersState';
import { FiltersWrapper } from './styled';
import { TagObject } from '../../types';

export interface FiltersProps {
  filters: FiltersState;
  updateFilters: UpdateFilters;
  onApply?: (filters: FiltersState) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filters,
  updateFilters,
  onApply: onApplyProp,
}) => {
  const [tagsFilterSelection, setTagsFilterSelection] = useState<TagObject[]>(filters.tagsFilter);
  const [isOnlyEmptyPromptsSelection, setIsOnlyEmptyPromptsSelection] = useState(
    filters.isOnlyEmptyPrompts
  );
  const [isKeepUnsavedSelection, setIsKeepUnsavedSelection] = useState<boolean>(true);
  const [isUncroppedSelection, setIsUncroppedSelection] = useState<boolean>(false);

  useEffect(() => {
    setTagsFilterSelection(filters.tagsFilter);
    setIsOnlyEmptyPromptsSelection(filters.isOnlyEmptyPrompts);
    setIsKeepUnsavedSelection(filters.isKeepUnsaved);
    setIsUncroppedSelection(filters.isUncropped);
  }, [filters]);

  const onApply = useCallback(() => {
    const newFilters: FiltersState = {
      tagsFilter: tagsFilterSelection,
      isOnlyEmptyPrompts: isOnlyEmptyPromptsSelection,
      isKeepUnsaved: isKeepUnsavedSelection,
      isUncropped: isUncroppedSelection,
    };
    updateFilters(newFilters);
    onApplyProp?.(newFilters);
  }, [
    isKeepUnsavedSelection,
    isOnlyEmptyPromptsSelection,
    isUncroppedSelection,
    onApplyProp,
    tagsFilterSelection,
    updateFilters,
  ]);

  return (
    <FiltersWrapper>
      <TagsSelect
        selected={tagsFilterSelection}
        onChange={setTagsFilterSelection}
        disabled={isOnlyEmptyPromptsSelection}
      />
      <FormControlLabel
        control={
          <Switch
            checked={isOnlyEmptyPromptsSelection}
            onChange={(e) => setIsOnlyEmptyPromptsSelection(e.target.checked)}
          />
        }
        label="With empty prompts"
      />
      <FormControlLabel
        control={
          <Switch
            checked={isKeepUnsavedSelection}
            onChange={(e) => setIsKeepUnsavedSelection(e.target.checked)}
          />
        }
        label="Don't filter unsaved"
      />
      <FormControlLabel
        control={
          <Switch
            checked={isUncroppedSelection}
            onChange={(e) => setIsUncroppedSelection(e.target.checked)}
          />
        }
        label="Not cropped to 512x512"
      />

      <Button onClick={onApply}>Apply</Button>
    </FiltersWrapper>
  );
};
