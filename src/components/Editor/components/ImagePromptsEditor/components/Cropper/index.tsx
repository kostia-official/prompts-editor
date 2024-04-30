import React, { useCallback, Ref } from 'react';
import {
  Cropper as AdvanceCropper,
  ImageRestriction,
  CropperRef,
  ImageSize,
} from 'react-advanced-cropper';
import { ImageUrlResolver } from '../../../../../../common/components/ImageUrlResolver';
import { ImagePrompts } from '../../../../../../types';
import { ImageWrapper } from './styled';

export interface CropperProps {
  cropperRef: Ref<CropperRef>;
  imagePrompts: ImagePrompts;
  onImageSizeLoaded: (imageSize: ImageSize) => void;
}

export const Cropper: React.FC<CropperProps> = ({
  cropperRef,
  imagePrompts,
  onImageSizeLoaded,
}) => {
  const onImageLoaded = useCallback(
    (cropper: CropperRef) => {
      const isLoaded = cropper.isLoaded();
      const image = cropper.getImage();

      if (isLoaded && image) {
        const { width, height } = image;
        onImageSizeLoaded({ width, height });
      }
    },
    [onImageSizeLoaded]
  );

  return (
    <ImageWrapper>
      <ImageUrlResolver file={imagePrompts.imageFile}>
        {(imageUrl) => (
          <AdvanceCropper
            ref={cropperRef}
            src={imageUrl}
            style={{ width: '512px' }}
            className="cropper"
            stencilProps={{
              handlers: true,
              lines: false,
              movable: false,
              resizable: true,
            }}
            defaultSize={({ imageSize, visibleArea }) => {
              return {
                width: (visibleArea || imageSize).width,
                height: (visibleArea || imageSize).height,
              };
            }}
            backgroundWrapperProps={{
              scaleImage: {
                wheel: {
                  ratio: 0.01,
                },
              },
            }}
            imageRestriction={ImageRestriction.stencil}
            onUpdate={onImageLoaded}
          />
        )}
      </ImageUrlResolver>
    </ImageWrapper>
  );
};
