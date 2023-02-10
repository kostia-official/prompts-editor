import React, { useState, useCallback } from 'react';
import { TagsSelect } from '../TagsSelect';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { Persist } from 'react-persist';
import { FiltersState, UpdateFilters } from './hooks/useFiltersState';
import { FiltersWrapper } from './styled';
import { TagObject } from '../../types';

export interface FiltersProps {
  cacheKey: string;
  filters: FiltersState;
  updateFilters: UpdateFilters;
  onApply?: (filters: FiltersState) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  cacheKey,
  filters,
  updateFilters,
  onApply: onApplyProp,
}) => {
  const [tagsFilterSelection, setTagsFilterSelection] = useState<TagObject[]>([]);
  const [isOnlyEmptyPromptsSelection, setIsOnlyEmptyPromptsSelection] = useState(false);

  const onApply = useCallback(() => {
    const newFilters = {
      tagsFilter: tagsFilterSelection,
      isOnlyEmptyPrompts: isOnlyEmptyPromptsSelection,
    };
    updateFilters(newFilters);
    onApplyProp?.(newFilters);
  }, [isOnlyEmptyPromptsSelection, onApplyProp, tagsFilterSelection, updateFilters]);

  return (
    <FiltersWrapper>
      <Persist
        name={cacheKey}
        data={filters}
        onMount={(filters) => {
          updateFilters(filters);
        }}
      />

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

      <Button onClick={onApply}>Apply</Button>
    </FiltersWrapper>
  );
};
