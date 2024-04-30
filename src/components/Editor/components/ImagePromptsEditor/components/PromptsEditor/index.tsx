import React, { useCallback } from 'react';
import { tagsArray } from '../../../../../../data/tags';
import { TagObject, ImagePrompts } from '../../../../../../types';
import { Wrapper } from './styled';
import { TagsSelect } from '../../../../../TagsSelect';
import { addBrackets, cleanBrackets, countBrackets } from '../../../../../../utils';

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
      const attention = countBrackets(trimmedTag.replace('\\', ''));
      const cleanedTag = cleanBrackets(trimmedTag);

      const group = tagsArray.find((item) => item.tag === cleanedTag)?.group || 'unknown';
      return { tag: cleanedTag, group, attention };
    });
  };

  const [promptsTags, setPromptsTags] = React.useState<TagObject[]>(parseTags());
  const getPromptsStringFromTags = useCallback((tags: TagObject[]) => {
    return tags.map(({ tag, attention = 0 }) => addBrackets(tag, attention)).join(', ');
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
