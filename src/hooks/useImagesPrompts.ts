import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useCallback } from 'react';
import { ImagePrompts } from '../types';

export const useGetAllImagesPrompts = () => {
  const imagesPrompts = useLiveQuery(async () => {
    return db.imagesPrompts.orderBy('name').toArray();
  });

  return { imagesPrompts, loading: !imagesPrompts };
};

export const useGetUnsavedImagesPrompts = () => {
  const imagesPrompts = useLiveQuery(async () => {
    return db.imagesPrompts.where('isSaved').equals(0).toArray();
  });

  return { imagesPrompts, loading: !imagesPrompts };
};

export const useImagesPromptsMutations = () => {
  const update = useCallback((data: ImagePrompts) => {
    db.imagesPrompts.update(data.name, data);
  }, []);

  const put = useCallback((data: ImagePrompts) => {
    return db.imagesPrompts.put(data);
  }, []);

  const bulkPut = useCallback((data: ImagePrompts[]) => {
    return db.imagesPrompts.bulkPut(data);
  }, []);

  const remove = useCallback((name: string) => {
    return db.imagesPrompts.delete(name);
  }, []);

  return { update, put, bulkPut, remove };
};
