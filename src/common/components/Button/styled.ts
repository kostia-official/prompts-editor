import styled from '@emotion/styled';
import { Button, CircularProgress } from '@mui/material';

export const ButtonStyled = styled(Button)<{
  $noWrap: boolean;
}>`
  font-weight: bold;
  white-space: ${(p) => (p.$noWrap ? 'nowrap' : 'inherit')};
`;

export const ButtonContent = styled.div<{ $visible: boolean }>`
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
`;

export const Loader = styled(CircularProgress)`
  position: absolute;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
`;

export const DisabledButtonWrapper = styled.div<{
  $isDisabled: boolean;
}>`
  width: 100%;
  cursor: ${(p) => (p.$isDisabled ? 'default' : 'inherit')};
`;
