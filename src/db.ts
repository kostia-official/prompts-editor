import Dexie, { Table } from 'dexie';
import { ImagePrompts } from './types';

export class TrainHelperDB extends Dexie {
  imagesPrompts!: Table<ImagePrompts>;

  constructor() {
    super('trainHelperDB');
    this.version(1).stores({
      imagesPrompts: 'name, promptsString, isSaved',
    });
  }
}

export const db = new TrainHelperDB();
