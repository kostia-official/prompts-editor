import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { ImagePrompts } from '../../types';
import { getFileTextContent } from '../../utils';
import { useImagesPromptsMutations } from '../../hooks/useImagesPrompts';
import { useSnackbar } from 'notistack';

async function parseFiles(
  files: File[]
): Promise<{ imagesPrompts: ImagePrompts[]; promptsWithoutImage: string[] }> {
  const imagesPrompts: ImagePrompts[] = [];
  const promptsWithoutImage: string[] = [];

  for (const file of files) {
    const fileName = file.name.split('.')[0];

    let existingImagesPrompts = imagesPrompts.find((ip) => ip.name === fileName);

    if (file.type.startsWith('image/')) {
      if (!existingImagesPrompts) {
        existingImagesPrompts = {
          name: fileName,
          imageFile: file,
          isSaved: 1,
        };
        imagesPrompts.push(existingImagesPrompts);
      }
    }
  }

  for (const file of files) {
    const fileName = file.name.split('.')[0];
    let existingImagesPrompts = imagesPrompts.find((ip) => ip.name === fileName);

    if (file.type === 'text/plain') {
      if (!existingImagesPrompts) {
        promptsWithoutImage.push(fileName);
      } else {
        existingImagesPrompts.promptsString = await getFileTextContent(file);
      }
    }
  }

  return { imagesPrompts, promptsWithoutImage };
}

export const ImportFiles: React.FC = () => {
  const { bulkPut } = useImagesPromptsMutations();
  const { enqueueSnackbar } = useSnackbar();

  const { getInputProps } = useDropzone({
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        enqueueSnackbar(`Rejected\n ${JSON.stringify(fileRejections)}`, {
          variant: 'error',
          autoHideDuration: 10000,
        });
        return;
      }

      const { promptsWithoutImage, imagesPrompts } = await parseFiles(acceptedFiles);
      await bulkPut(imagesPrompts);

      if (promptsWithoutImage.length) {
        enqueueSnackbar(`Prompts without image\n ${JSON.stringify(promptsWithoutImage)}`, {
          variant: 'error',
          autoHideDuration: 10000,
        });
        return;
      }
    },
    accept: {
      '': ['.png', '.jpeg', '.jpg', '.txt'],
    },
  });

  return (
    <Button variant="contained" component="label">
      Import
      <input {...getInputProps()} />
    </Button>
  );
};
