import React, { useCallback, Ref } from 'react';
import { FixedCropper, ImageRestriction, FixedCropperRef, ImageSize } from 'react-advanced-cropper';
import { ImageUrlResolver } from '../../../../../../common/components/ImageUrlResolver';
import { ImagePrompts } from '../../../../../../types';
import { ImageWrapper } from './styled';

export interface CropperProps {
  cropperRef: Ref<FixedCropperRef>;
  imagePrompts: ImagePrompts;
  onImageSizeLoaded: (imageSize: ImageSize) => void;
}

export const Cropper: React.FC<CropperProps> = ({
  cropperRef,
  imagePrompts,
  onImageSizeLoaded,
}) => {
  const onImageLoaded = useCallback(
    (cropper: FixedCropperRef) => {
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
          <FixedCropper
            ref={cropperRef}
            src={imageUrl}
            style={{ width: '512px' }}
            className="cropper"
            stencilProps={{
              handlers: true,
              lines: false,
              movable: false,
              resizable: false,
            }}
            stencilSize={{
              width: 512,
              height: 512,
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
