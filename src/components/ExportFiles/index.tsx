import { Button, TextField } from '@mui/material';
import React, { useCallback } from 'react';
import { Wrapper } from './styled';
import { useSnackbar } from 'notistack';
import {
  useImagesPromptsMutations,
  useGetUnsavedImagesPrompts,
} from '../../hooks/useImagesPrompts';
import useLocalStorageState from 'use-local-storage-state';

const { ipcRenderer } = window.require('electron');

export const ExportFiles: React.FC = () => {
  const { imagesPrompts: unsavedImagesPrompts } = useGetUnsavedImagesPrompts();
  const { update } = useImagesPromptsMutations();

  const [exportPath, setExportPath] = useLocalStorageState<string>('exportPath', {
    defaultValue: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const onExport = useCallback(async () => {
    if (!unsavedImagesPrompts) {
      enqueueSnackbar('Import or edit data first!', {
        autoHideDuration: 5000,
        variant: 'error',
      });
      return;
    }

    await Promise.all(
      unsavedImagesPrompts.map(async (imagePrompt) => {
        const { name, promptsString } = imagePrompt;
        const fileConfig = { name: `${name}.txt`, promptsString };
        try {
          await ipcRenderer.invoke('save-file', { exportPath, fileConfig });

          await update({ ...imagePrompt, isSaved: 1 });
        } catch (err) {
          enqueueSnackbar(`Can't save prompts for ${name}`, {
            autoHideDuration: 3000,
            variant: 'error',
          });
        }
      })
    );

    enqueueSnackbar('Prompts were saved', { autoHideDuration: 3000, variant: 'success' });
  }, [enqueueSnackbar, exportPath, unsavedImagesPrompts, update]);

  return (
    <Wrapper>
      <Button variant="contained" onClick={onExport} disabled={!unsavedImagesPrompts?.length}>
        Export
      </Button>
      <TextField
        variant="standard"
        placeholder="Export path"
        fullWidth
        value={exportPath}
        onChange={(e) => setExportPath(e.target.value)}
      />
    </Wrapper>
  );
};
