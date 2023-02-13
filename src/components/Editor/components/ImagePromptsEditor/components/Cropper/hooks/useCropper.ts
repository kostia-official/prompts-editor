import { useRef, useCallback, useState } from 'react';
import { FixedCropperRef, ImageSize } from 'react-advanced-cropper';
import { ImagePrompts } from '../../../../../../../types';

export interface HookArgs {
  imagePrompts: ImagePrompts;
  onCropCompleted: (file: File) => void;
}

export const useCropper = ({ imagePrompts, onCropCompleted }: HookArgs) => {
  const cropperRef = useRef<FixedCropperRef>(null);

  const cropImage = useCallback(async () => {
    const canvas = cropperRef.current?.getCanvas({
      height: 512,
      width: 512,
    });

    canvas?.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], imagePrompts.imageFile.name);
      onCropCompleted(file);
    }, imagePrompts.imageFile.type);
  }, [imagePrompts.imageFile.name, imagePrompts.imageFile.type, onCropCompleted]);

  const [imageSizeText, setImageSizeText] = useState<string>('');
  const onImageSizeLoaded = useCallback(({ width, height }: ImageSize) => {
    setImageSizeText(`(${width}x${height})`);
  }, []);

  return { cropperRef, cropImage, imageSizeText, onImageSizeLoaded };
};
