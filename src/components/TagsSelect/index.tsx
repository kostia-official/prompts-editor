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
    return (
      <Chip
        key={value.tag}
        label={`${value.tag}${value.attention ? ` +${value.attention}` : ''}`}
        disabled={chipDisabled}
        onClick={onChipClick}
        onDelete={(e) => {
          onDelete(value.tag);
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ zIndex: 2000 }} // to use in modal
      />
    );
  }
);

interface SortableListProps {
  items: TagObject[];
  onDelete: (tag: string) => void;
  disabled?: boolean;
  onChipClick: (tag: TagObject) => void;
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
            onChipClick={() => onChipClick(value)}
          />
        ))}
      </ChipsWrapper>
    );
  }
);

export const TagsSelect: React.FC<TagsSelectProps> = ({ selected, onChange, onBlur, disabled }) => {
  const inputRef: React.Ref<any> = React.useRef(null);
  const selectedTags = selected.flatMap(({ tag }) => tag);

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

  const incrementAttention = useCallback(
    (toInc: TagObject) => {
      onChange(
        selected.map((tag) => {
          if (toInc.tag !== tag.tag) return tag;

          if (tag.attention === undefined) {
            return { ...tag, attention: 1 };
          } else if (tag.attention + 1 === 3) {
            return { ...tag, attention: 0 };
          } else {
            return { ...tag, attention: tag.attention + 1 };
          }
        })
      );
    },
    [onChange, selected]
  );

  const focusInput = useCallback(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  return (
    <Autocomplete
      fullWidth
      multiple
      freeSolo
      disableCloseOnSelect
      autoHighlight
      clearOnBlur
      disabled={disabled}
      options={tagsArray}
      getOptionDisabled={(option) => selectedTags.includes(option.tag)}
      getOptionLabel={(option) => (option as TagObject)?.tag}
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
          onDelete={(tag) => {
            onDelete(tag);
            focusInput();
          }}
          onChipClick={(tag) => {
            incrementAttention(tag);
            focusInput();
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
