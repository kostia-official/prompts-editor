export interface ImagePrompts {
  name: string;
  imageFile: File;
  promptsString?: string;
  isSaved: 0 | 1; // booleans can't be indexed
}

export interface TagObject {
  tag: string;
  group: string;
  attention?: number;
}

export interface PromptsFileConfig {
  name: string;
  promptsString: string;
}
