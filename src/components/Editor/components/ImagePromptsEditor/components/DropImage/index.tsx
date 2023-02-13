import React from 'react';
import { useDropzone } from 'react-dropzone';
import { StyledPaper } from './styled';

export interface DropImageProps {
  onImageDrop: (file: File) => void;
}

export const DropImage: React.FC<DropImageProps> = ({ onImageDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onImageDrop(acceptedFiles[0]),
    maxFiles: 1,
  });

  return (
    <StyledPaper variant="outlined">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </StyledPaper>
  );
};
