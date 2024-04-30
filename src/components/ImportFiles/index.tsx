import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@mui/material';
import { ImagePrompts } from '../../types';
import { getFileTextContent } from '../../utils';
import {
  useGetAllImagesPromptsCount,
  useImagesPromptsMutations,
} from '../../hooks/useImagesPrompts';
import { useSnackbar } from 'notistack';

export const getFileName = (file: File) => {
  const extension = file.name.split('.').at(-1);
  if (!extension) {
    throw new Error(`wrong file name ${file.name}`);
  }

  return file.name.replace(`.${extension}`, '');
};

async function parseFiles(
  files: File[]
): Promise<{ imagesPrompts: ImagePrompts[]; promptsWithoutImage: string[] }> {
  const imagesPrompts: ImagePrompts[] = [];
  const promptsWithoutImage: string[] = [];

  const imagesFiles = files.filter((file) => file.type.startsWith('image/'));
  const promptsFiles = files.filter((file) => file.type === 'text/plain');

  for (const imageFile of imagesFiles) {
    const fileName = getFileName(imageFile);

    const promptFile = promptsFiles.find((file) => getFileName(file) === fileName);
    const promptsString = promptFile ? await getFileTextContent(promptFile) : '';

    imagesPrompts.push({
      name: fileName,
      imageFile,
      isSaved: 1,
      promptsString,
    });
  }

  for (const promptFile of promptsFiles) {
    const fileName = getFileName(promptFile);

    const imageFile = imagesFiles.find((file) => getFileName(file) === fileName);
    if (!imageFile) {
      promptsWithoutImage.push(fileName);
    }
  }

  return { imagesPrompts, promptsWithoutImage };
}

export const ImportFiles: React.FC = () => {
  const { bulkPut, clear } = useImagesPromptsMutations();
  const { enqueueSnackbar } = useSnackbar();

  const { count } = useGetAllImagesPromptsCount();

  const { getInputProps } = useDropzone({
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length) {
        enqueueSnackbar(`Rejected\n ${JSON.stringify(fileRejections)}`, {
          variant: 'error',
          autoHideDuration: 10000,
        });
        return;
      }

      try {
        const { promptsWithoutImage, imagesPrompts } = await parseFiles(acceptedFiles);
        await bulkPut(imagesPrompts);

        if (promptsWithoutImage.length) {
          enqueueSnackbar(`Found prompts without image! ${promptsWithoutImage}`, {
            variant: 'error',
            autoHideDuration: 10000,
          });
          return;
        }
      } catch (err) {
        enqueueSnackbar(String(err), {
          variant: 'error',
          autoHideDuration: 10000,
        });
      }
    },
    accept: {
      '': ['.png', '.jpeg', '.jpg', '.txt', '.webp'],
    },
  });

  return (
    <>
      <Button variant="contained" component="label" onClick={() => clear()} disabled={!count}>
        Clear
      </Button>

      <Button variant="contained" component="label">
        Import
        <input {...getInputProps()} />
      </Button>
    </>
  );
};
