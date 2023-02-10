import React, { useCallback } from 'react';
import { ImagePrompts } from '../../../../types';
import { Wrapper, Image, ImageWrapper, ButtonsWrapper } from './styled';
import { PromptsEditor } from './components/PromptsEditor';
import { Button } from '@mui/material';
import { useImagesPromptsMutations } from '../../../../hooks/useImagesPrompts';
import useLocalStorageState from 'use-local-storage-state';
import { useSnackbar } from 'notistack';

const { ipcRenderer } = window.require('electron');

export interface ImagePromptsEditorProps {
  imagePrompts: ImagePrompts;
  onRemove?: () => void;
}

export const ImagePromptsEditor: React.FC<ImagePromptsEditorProps> = ({
  imagePrompts,
  onRemove,
}) => {
  const { update, remove } = useImagesPromptsMutations();
  const { enqueueSnackbar } = useSnackbar();

  const onPromptsChange = useCallback(
    (promptsString: string) => {
      update({ ...imagePrompts, promptsString, isSaved: 0 });
    },
    [imagePrompts, update]
  );
  const [exportPath] = useLocalStorageState<string>('exportPath');

  const removeFromDB = useCallback(() => {
    remove(imagePrompts.name);
    onRemove?.();
  }, [imagePrompts.name, onRemove, remove]);

  const removeFromDBWithFile = useCallback(async () => {
    try {
      await ipcRenderer.invoke('delete-files', {
        exportPath,
        names: [
          imagePrompts.imageBlob.name,
          ...(imagePrompts.promptsString ? [`${imagePrompts.name}.txt`] : []),
        ],
      });
      await removeFromDB();
    } catch (err) {
      enqueueSnackbar(`Removing failed: ${JSON.stringify(err)}`, {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }
  }, [
    exportPath,
    imagePrompts.imageBlob.name,
    imagePrompts.promptsString,
    imagePrompts.name,
    removeFromDB,
    enqueueSnackbar,
  ]);

  return (
    <Wrapper>
      <ImageWrapper>
        <Image
          src={window.URL.createObjectURL(imagePrompts.imageBlob)}
          alt={imagePrompts.name}
          loading="lazy"
        />
      </ImageWrapper>
      <PromptsEditor
        imagePrompts={imagePrompts}
        onChange={onPromptsChange}
        extraContent={
          <ButtonsWrapper>
            <Button variant="outlined" onClick={removeFromDB}>
              Remove
            </Button>

            <Button variant="outlined" onClick={removeFromDBWithFile}>
              Remove with file
            </Button>
          </ButtonsWrapper>
        }
      />
    </Wrapper>
  );
};
