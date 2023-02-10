import styled from '@emotion/styled';
import { ButtonBase, Dialog, DialogContent } from '@mui/material';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ImagePromptsWrapper = styled(ButtonBase)`
  position: relative;
`;

export const DialogStyled = styled(Dialog)`
  .MuiDialog-container {
    min-width: 90vw;
  }
`;

export const DialogContentStyled = styled(DialogContent)`
  min-width: 90vw;
`;

export const Prompts = styled.div`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.56);
  border-radius: 16px;
  padding: 4px 8px;
  top: 8px;
  left: 0;
  width: 96%;
`;
