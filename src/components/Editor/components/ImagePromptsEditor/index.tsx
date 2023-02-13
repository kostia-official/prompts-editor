import React, { useCallback } from 'react';
import { ImagePrompts } from '../../../../types';
import { Wrapper, ButtonsWrapper, RightBlockWrapper, FileNameWrapper } from './styled';
import { PromptsEditor } from './components/PromptsEditor';
import { Button, Chip, Typography } from '@mui/material';
import { useImagesPromptsMutations } from '../../../../hooks/useImagesPrompts';
import { useImageEnhance } from './hooks/useImageEnhance';
import { ButtonLoadable } from '../../../../common/components/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Cropper } from './components/Cropper';
import { useCropper } from './components/Cropper/hooks/useCropper';
import { DropImage } from './components/DropImage';
import { useLocalStorageState } from '../../../../hooks/useLocalStorageState';

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

  const onPromptsChange = useCallback(
    (promptsString: string) => {
      update({ ...imagePrompts, promptsString, isSaved: 0 });
    },
    [imagePrompts, update]
  );
  const [exportPath] = useLocalStorageState<string>('exportPath', '');

  const removeFromDB = useCallback(() => {
    remove(imagePrompts.name);
    onRemove?.();
  }, [imagePrompts.name, onRemove, remove]);

  const removeFromDBWithFile = useCallback(async () => {
    await ipcRenderer.invoke('delete-files', {
      exportPath,
      imageName: imagePrompts.imageFile.name,
      promptsName: `${imagePrompts.name}.txt`,
    });
    await removeFromDB();
  }, [exportPath, imagePrompts.imageFile.name, imagePrompts.name, removeFromDB]);

  const showImageInFs = useCallback(async () => {
    await ipcRenderer.invoke('show-file-in-fs', {
      exportPath,
      imageName: imagePrompts.imageFile.name,
    });
  }, [exportPath, imagePrompts.imageFile.name]);

  const syncImageWithFs = useCallback(async () => {
    const imageBuffer = await ipcRenderer.invoke('sync-image-fs', {
      exportPath,
      imageName: imagePrompts.imageFile.name,
    });
    const { type } = imagePrompts.imageFile;
    const blob = new Blob([imageBuffer], { type });
    const imageFile = new File([blob], imagePrompts.imageFile.name, { type });

    await update({ ...imagePrompts, imageFile, isSaved: 0 });
  }, [exportPath, imagePrompts, update]);

  const { cropImage, onImageSizeLoaded, imageSizeText, cropperRef } = useCropper({
    imagePrompts,
    onCropCompleted: (file) => {
      update({ ...imagePrompts, imageFile: file, isSaved: 0 });
    },
  });

  const { isEnhancing, enhanceImage } = useImageEnhance();
  const onEnhanceClick = useCallback(async () => {
    const newImageFile = await enhanceImage(imagePrompts.imageFile);
    await update({ ...imagePrompts, imageFile: newImageFile, isSaved: 0 });
  }, [enhanceImage, imagePrompts, update]);

  const onImageDrop = useCallback(
    (file: File) => {
      update({ ...imagePrompts, imageFile: file, isSaved: 0 });
    },
    [imagePrompts, update]
  );

  return (
    <Wrapper>
      <Cropper
        cropperRef={cropperRef}
        imagePrompts={imagePrompts}
        onImageSizeLoaded={onImageSizeLoaded}
      />

      <RightBlockWrapper>
        <FileNameWrapper>
          <Typography>{`${imagePrompts.imageFile.name} ${imageSizeText}`}</Typography>
          {!imagePrompts.isSaved && (
            <Chip label="Unsaved" color="warning" variant="filled" size="small" />
          )}
          <Button
            startIcon={<SearchIcon />}
            variant="outlined"
            size="small"
            onClick={showImageInFs}
          >
            Show in FS
          </Button>
          <Button variant="outlined" size="small" onClick={syncImageWithFs}>
            Sync with FS
          </Button>
        </FileNameWrapper>

        <PromptsEditor imagePrompts={imagePrompts} onChange={onPromptsChange} />

        <ButtonsWrapper>
          <Button variant="outlined" onClick={cropImage}>
            Crop
          </Button>

          <ButtonLoadable variant="outlined" onClick={onEnhanceClick} loading={isEnhancing}>
            Enhance
          </ButtonLoadable>

          <Button variant="outlined" onClick={removeFromDB} color="error">
            Remove
          </Button>

          <Button variant="outlined" onClick={removeFromDBWithFile} color="error">
            Remove with file
          </Button>
        </ButtonsWrapper>

        <DropImage onImageDrop={onImageDrop} />
      </RightBlockWrapper>
    </Wrapper>
  );
};
