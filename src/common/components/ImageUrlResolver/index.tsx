import React from 'react';

export interface ImageUrlResolverProps {
  file: File;
  children: (imageUrl: string | undefined) => React.ReactNode;
}

export const ImageUrlResolver: React.FC<ImageUrlResolverProps> = React.memo(
  ({ file, children }) => {
    return <>{children(window.URL.createObjectURL(file))}</>;
  },
  (prevProps, nextProps) => prevProps.file.size === nextProps.file.size
);
