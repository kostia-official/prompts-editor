import { useCallback, useState } from 'react';
import deepai from 'deepai';
import { fileToBase64 } from '../../../../../utils';

deepai.setApiKey(process.env.REACT_APP_DEEPAI_API_KEY!);

export const useImageEnhance = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhanceImage = useCallback(async (imageFile: File) => {
    setIsEnhancing(true);

    let newImageFile: File;

    try {
      const res = await deepai.callStandardApi('torch-srgan', {
        image: await fileToBase64(imageFile),
      });
      const image = await fetch(res.output_url);
      const imageBlob = await image.blob();
      newImageFile = new File([imageBlob], imageFile.name, {
        type: imageFile.type,
      });
    } finally {
      setIsEnhancing(false);
    }

    return newImageFile;
  }, []);

  return { isEnhancing, enhanceImage };
};
