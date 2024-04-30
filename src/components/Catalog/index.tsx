import { ImageList, ImageListItem, DialogContent, LinearProgress, Chip } from '@mui/material';
import React, { useState, useCallback, useEffect } from 'react';
import { ImagePrompts } from '../../types';
import { ImagePromptsWrapper, Prompts, Wrapper, DialogStyled } from './styled';
import { ImagePromptsEditor } from '../Editor/components/ImagePromptsEditor';
import { useGetAllImagesPrompts } from '../../hooks/useImagesPrompts';
import { Filters } from '../Filters';
import { useFiltersState } from '../Filters/hooks/useFiltersState';

export const Catalog: React.FC = () => {
  const [imagePromptsForEdit, setImagePromptsForEdit] = useState<ImagePrompts>();
  const { filters, updateFilters, getFilteredImagesPrompts } = useFiltersState({ key: 'catalog' });
  const { imagesPrompts } = useGetAllImagesPrompts();

  const [filteredImagesPrompts, setFilteredImagesPrompts] = useState<ImagePrompts[]>([]);

  useEffect(() => {
    (async () => {
      const filtered = await getFilteredImagesPrompts(imagesPrompts);
      setFilteredImagesPrompts(filtered);
    })();
  }, [getFilteredImagesPrompts, imagesPrompts, filters]);

  const onImagePromptsRemove = useCallback(() => {
    setImagePromptsForEdit(undefined);
  }, []);

  const getImageUrl = useCallback((imageFile: File) => {
    return window.URL.createObjectURL(imageFile);
  }, []);

  return (
    <>
      <Wrapper>
        <Filters filters={filters} updateFilters={updateFilters} />

        {!imagesPrompts && <LinearProgress />}

        <ImageList cols={3} variant="masonry">
          {filteredImagesPrompts.map((item: ImagePrompts) => (
            <ImagePromptsWrapper key={item.name} onClick={() => setImagePromptsForEdit(item)}>
              <ImageListItem>
                <img src={getImageUrl(item.imageFile)} alt={item.name} loading="lazy" />
              </ImageListItem>

              {item.promptsString && (
                <Prompts>
                  {item.promptsString}{' '}
                  {!item.isSaved && (
                    <Chip label="Unsaved" color="warning" variant="filled" size="small" />
                  )}
                </Prompts>
              )}
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
