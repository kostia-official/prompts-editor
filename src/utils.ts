import { TagObject } from './types';

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
