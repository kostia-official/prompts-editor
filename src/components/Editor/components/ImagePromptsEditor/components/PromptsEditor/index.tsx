import React, { useCallback } from 'react';
import { tagsArray } from '../../../../../../data/tags';
import { TagObject, ImagePrompts } from '../../../../../../types';
import { Wrapper } from './styled';
import { TagsSelect } from '../../../../../TagsSelect';

export interface PromptsEditorProps {
  imagePrompts: ImagePrompts;
  onChange: (promptsString: string) => void;
  extraContent?: React.ReactNode;
}

export const PromptsEditor: React.FC<PromptsEditorProps> = ({
  imagePrompts,
  onChange,
  extraContent,
}) => {
  const parseTags = (): TagObject[] => {
    if (!imagePrompts.promptsString) return [];
    const tags = imagePrompts.promptsString.split(',');

    return tags.map((tag) => {
      const trimmedTag = tag.trim();
      const group = tagsArray.find((item) => item.tag === trimmedTag)?.group || 'unknown';
      return { tag: trimmedTag, group };
    });
  };

  const [promptsTags, setPromptsTags] = React.useState<TagObject[]>(parseTags());
  const getPromptsStringFromTags = useCallback((tags: TagObject[]) => {
    return tags.map((tag) => tag.tag).join(', ');
  }, []);

  return (
    <Wrapper>
      <TagsSelect
        selected={promptsTags}
        onChange={(newTags) => {
          setPromptsTags(newTags);
        }}
        onBlur={() => onChange(getPromptsStringFromTags(promptsTags))}
      />

      {extraContent}
    </Wrapper>
  );
};
