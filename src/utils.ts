import { TagObject } from './types';
import { ImageSize } from 'react-advanced-cropper';

export async function getFileBase64String(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
  });
}

export async function getFileTextContent(file: File): Promise<string> {
  const base64 = await getFileBase64String(file);
  const [, base64Hash] = base64.split(',');
  return Buffer.from(base64Hash, 'base64').toString('utf8');
}

export function getTagArray(tags: { [key: string]: string[] }): TagObject[] {
  const tagArray: TagObject[] = [];

  Object.entries(tags).forEach(([group, tagList]) => {
    tagList.forEach((tag) => {
      tagArray.push({ tag, group });
    });
  });

  return tagArray;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string); // TODO: handle negative case
    reader.readAsDataURL(file);
  });
}

export async function getImageSize(file: File): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.src = url;
    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };
    image.onerror = (error) => {
      reject(error);
      URL.revokeObjectURL(url);
    };
  });
}
