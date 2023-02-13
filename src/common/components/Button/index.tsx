import React from 'react';
import { ButtonProps } from '@mui/material';
import { ButtonStyled, Loader, ButtonContent } from './styled';
export { DisabledButtonWrapper } from './styled';

export type Props = Omit<ButtonProps, 'color'> & {
  loading?: boolean;
  'data-testid'?: string;
  className?: string;
  noWrap?: boolean;
};

export const ButtonLoadable: React.FC<Props> = ({
  children,
  'data-testid': dataTestId,
  loading = false,
  noWrap = false,
  size = 'medium',
  startIcon,
  ...props
}) => {
  return (
    <ButtonStyled
      {...props}
      size={size}
      $noWrap={noWrap}
      data-testid={dataTestId}
      disabled={loading}
    >
      {loading && <Loader size={20} data-testid={`${dataTestId}-spinner`} />}

      <ButtonContent $visible={!loading}>{children}</ButtonContent>
    </ButtonStyled>
  );
};
