import React, { MouseEventHandler, useCallback } from 'react';
import { tagsArray } from '../../data/tags';
import { TagObject } from '../../types';
import { TextField, Autocomplete, Chip } from '@mui/material';
import { ChipsWrapper } from '../Editor/components/ImagePromptsEditor/components/PromptsEditor/styled';
import { SortableElement, SortableContainer, SortEndHandler } from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';

export interface TagsSelectProps {
  selected: TagObject[];
  onChange: (newTags: TagObject[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

interface SortableItemProps {
  value: TagObject;
  onDelete: (tag: string) => void;
  chipDisabled?: boolean;
  onChipClick: () => void;
}
const SortableItem = SortableElement<SortableItemProps>(
  ({ value, onDelete, chipDisabled, onChipClick }: SortableItemProps) => {
    const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <Chip
        key={value.tag}
        label={value.tag}
        onMouseDown={onMouseDown}
        disabled={chipDisabled}
        onDelete={() => onDelete(value.tag)}
        onMouseDownCapture={onChipClick}
        style={{ zIndex: 2000 }} // to use in modal
      />
    );
  }
);

interface SortableListProps {
  items: TagObject[];
  onDelete: (tag: string) => void;
  disabled?: boolean;
  onChipClick: () => void;
}

const SortableList = SortableContainer<SortableListProps>(
  ({ items, onDelete, disabled, onChipClick }: SortableListProps) => {
    return (
      <ChipsWrapper>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.tag}`}
            index={index}
            value={value}
            onDelete={onDelete}
            chipDisabled={disabled}
            onChipClick={onChipClick}
          />
        ))}
      </ChipsWrapper>
    );
  }
);

export const TagsSelect: React.FC<TagsSelectProps> = ({ selected, onChange, onBlur, disabled }) => {
  const inputRef: React.Ref<any> = React.useRef(null);

  const onSortEnd: SortEndHandler = useCallback(
    ({ oldIndex, newIndex }) => {
      onChange(arrayMoveImmutable(selected, oldIndex, newIndex));
    },
    [onChange, selected]
  );

  const onDelete = useCallback(
    (tag: string) => {
      onChange(selected.filter((item) => item.tag !== tag));
    },
    [onChange, selected]
  );

  return (
    <Autocomplete
      fullWidth
      multiple
      freeSolo
      disableCloseOnSelect
      disabled={disabled}
      options={tagsArray}
      getOptionLabel={(option) => (option as TagObject).tag}
      groupBy={(option) => option.group}
      value={selected}
      onChange={(event, values) => {
        const tags: TagObject[] = values.map((value) => {
          // free solo
          return typeof value === 'string' ? { tag: value, group: 'unknown' } : value;
        });
        onChange(tags);
      }}
      renderTags={(value) => (
        <SortableList
          onSortEnd={onSortEnd}
          items={value}
          axis="xy"
          distance={4}
          disabled={disabled}
          getHelperDimensions={({ node }) => node.getBoundingClientRect()}
          onDelete={onDelete}
          onChipClick={() => {
            setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          }}
        />
      )}
      isOptionEqualToValue={(option, value) => option.tag === value.tag}
      renderInput={(params) => (
        <TextField {...params} inputRef={inputRef} variant="outlined" label="Tags" rows={2} />
      )}
      onBlur={() => {
        // let blur transition finish
        setTimeout(() => {
          onBlur?.();
        }, 0);
      }}
    />
  );
};
