export interface ImagePrompts {
  name: string;
  imageBlob: File;
  promptsString?: string;
  isSaved: 0 | 1; // booleans can't be indexed
}

export interface TagObject {
  tag: string;
  group: string;
}

export interface PromptsFileConfig {
  name: string;
  promptsString: string;
}
