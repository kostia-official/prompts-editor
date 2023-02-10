import { ImageList, ImageListItem, DialogContent, LinearProgress } from '@mui/material';
import React, { useState, useCallback } from 'react';
import { ImagePrompts } from '../../types';
import { ImagePromptsWrapper, Prompts, Wrapper, DialogStyled } from './styled';
import { ImagePromptsEditor } from '../Editor/components/ImagePromptsEditor';
import { useGetAllImagesPrompts } from '../../hooks/useImagesPrompts';
import { Filters } from '../Filters';
import { useFiltersState } from '../Filters/hooks/useFiltersState';

export const Catalog: React.FC = () => {
  const [imagePromptsForEdit, setImagePromptsForEdit] = useState<ImagePrompts>();
  const { filters, updateFilters, getFilteredImagesPrompts } = useFiltersState();
  const { imagesPrompts } = useGetAllImagesPrompts();

  const onImagePromptsRemove = useCallback(() => {
    setImagePromptsForEdit(undefined);
  }, []);

  return (
    <>
      <Wrapper>
        <Filters cacheKey="catalogFilters" filters={filters} updateFilters={updateFilters} />

        {!imagesPrompts && <LinearProgress />}

        <ImageList cols={4} variant="masonry">
          {getFilteredImagesPrompts(imagesPrompts).map((item) => (
            <ImagePromptsWrapper key={item.name} onClick={() => setImagePromptsForEdit(item)}>
              <ImageListItem>
                <img
                  src={window.URL.createObjectURL(item.imageBlob)}
                  alt={item.name}
                  loading="lazy"
                />
              </ImageListItem>

              {item.promptsString && <Prompts>{item.promptsString}</Prompts>}
            </ImagePromptsWrapper>
          ))}
        </ImageList>
      </Wrapper>

      <DialogStyled
        maxWidth="xl"
        open={!!imagePromptsForEdit}
        onClose={() => setImagePromptsForEdit(undefined)}
      >
        <DialogContent>
          {imagePromptsForEdit && (
            <ImagePromptsEditor
              imagePrompts={imagePromptsForEdit}
              onRemove={onImagePromptsRemove}
            />
          )}
        </DialogContent>
      </DialogStyled>
    </>
  );
};
