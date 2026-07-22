export interface ContinueActionParams {
  lastWords: string;
  targetWordCount: number;
  instruction?: string;
}

export interface RewriteActionParams {
  selection: string;
  instruction?: string;
}

export interface ExpandActionParams {
  selection: string;
  instruction?: string;
}

export interface DialogueActionParams {
  char1: string;
  char2: string;
  context: string;
  instruction?: string;
}

export interface SummarizeActionParams {
  selection: string;
  instruction?: string;
}

export interface GenerateLoreActionParams {
  entityType: string;
  schema: Record<string, unknown>;
  userDescription: string;
}
