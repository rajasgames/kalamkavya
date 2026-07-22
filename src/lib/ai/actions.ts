import {
  ContinueActionParams,
  RewriteActionParams,
  ExpandActionParams,
  DialogueActionParams,
  SummarizeActionParams,
  GenerateLoreActionParams
} from '@/types/ai.types';

export type AIAction = 'Continue' | 'Rewrite' | 'Expand' | 'Dialogue' | 'Summarize';

export const AI_ACTIONS: AIAction[] = ['Continue', 'Rewrite', 'Expand', 'Dialogue', 'Summarize'];

export function createContinueAction({ lastWords, targetWordCount, instruction = '' }: ContinueActionParams): string {
  return `Action: CONTINUE\n\nLast words: "${lastWords}"\n\nInstruction: Write the next ${targetWordCount} words continuing this scene naturally. ${instruction}`.trim();
}

export function createRewriteAction({ selection, instruction = '' }: RewriteActionParams): string {
  return `Action: REWRITE\n\nText to rewrite:\n${selection}\n\nInstruction: Rewrite this passage with improved clarity, rhythm, and impact. ${instruction}`.trim();
}

export function createExpandAction({ selection, instruction = '' }: ExpandActionParams): string {
  return `Action: EXPAND\n\nText to expand:\n${selection}\n\nInstruction: Expand this passage with more sensory details, descriptions, and depth. ${instruction}`.trim();
}

export function createDialogueAction({ char1, char2, context, instruction = '' }: DialogueActionParams): string {
  return `Action: DIALOGUE\n\nSpeaking: ${char1} and ${char2}\nContext: ${context}\n\nInstruction: Write a natural dialogue exchange. ${instruction}`.trim();
}

export function createSummarizeAction({ selection, instruction = '' }: SummarizeActionParams): string {
  return `Action: SUMMARIZE\n\nText to summarize:\n${selection}\n\nInstruction: Summarize this text concisely. ${instruction}`.trim();
}

export function createGenerateLoreAction({ entityType, schema, userDescription }: GenerateLoreActionParams): string {
  return `Action: GENERATE_LORE\n\nEntity Type: ${entityType}\n\nDescription: ${userDescription}\n\nReturn ONLY valid JSON matching this schema exactly:\n${JSON.stringify(schema, null, 2)}`;
}
