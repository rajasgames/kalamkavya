import ReactQuill from 'react-quill';
import { db } from '../db';
import { useStoryStore } from '@/stores/storyStore';
import { Entity } from '@/types';
import { AIAction } from './actions';

export interface PromptEngineParams {
  editorInstance: ReactQuill;
  projectId: string;
  actionType: AIAction;
  userInstruction?: string;
}

export interface AssistantPromptParams {
  projectId: string;
  forcedEntities: Entity[];
}

export interface PromptEngineResult {
  systemPrompt: string;
  contextSummary: string;
}

function getActionInstruction(actionType: AIAction): string {
  switch (actionType) {
    case 'Continue': return 'Continue the story from the current point naturally. Maintain the tone and POV.';
    case 'Rewrite': return 'Rewrite the selected text to be more engaging and vivid, without changing the core meaning.';
    case 'Expand': return 'Expand the selected text with more sensory details, descriptions, and depth.';
    case 'Dialogue': return 'Generate realistic dialogue that fits the characters and the current scene.';
    case 'Summarize': return 'Summarize the text concisely, focusing on key plot points and character decisions.';
    default: return 'Assist the user with their writing.';
  }
}

async function buildBaseSystemPrompt(projectId: string, detectedEntities: Entity[], rules: Entity[]): Promise<string> {
  const project = await db.projects.get(projectId);
  const aiSettings = await db.aiSettings.get('global');

  let systemPrompt = `[META]\nYou are an expert fiction writer. NEVER violate the [WORLD RULES] below.\n\n`;

  systemPrompt += `[PROFILE]\n`;
  if (project?.premise) {
    systemPrompt += `Project Premise: ${project.premise}\n`;
  }
  if (aiSettings?.profile) {
    systemPrompt += `Tone: ${aiSettings.profile.tone || 'Neutral'}\n`;
    systemPrompt += `POV: ${aiSettings.profile.pov || 'Third Person'}\n`;
    systemPrompt += `Prose Style: ${aiSettings.profile.proseStyle || 'Standard'}\n`;
  }
  systemPrompt += `\n`;

  if (detectedEntities.length > 0) {
    systemPrompt += `[CONTEXT - DETECTED ENTITIES]\n`;
    detectedEntities.forEach(e => {
      systemPrompt += `${e.name} (${e.type}): ${JSON.stringify(e.data)}\n`;
    });
    systemPrompt += `\n`;
  }

  if (rules.length > 0) {
    systemPrompt += `[WORLD RULES - ABSOLUTE CONSTRAINTS]\n`;
    rules.forEach((rule, idx) => {
      const ruleText = rule.data.aiRuleText || rule.name;
      systemPrompt += `${idx + 1}. ${ruleText}\n`;
    });
    systemPrompt += `\n`;
  }

  return systemPrompt;
}

export async function buildPrompt({
  editorInstance,
  projectId,
  actionType,
  userInstruction
}: PromptEngineParams): Promise<PromptEngineResult> {
  const t0 = performance.now();

  const quill = editorInstance.getEditor();
  const selection = quill.getSelection();
  const index = selection ? selection.index : quill.getLength();
  const startPos = Math.max(0, index - 2500);
  const length = index - startPos;
  const extractedText = quill.getText(startPos, length);
  const textLower = extractedText.toLowerCase();

  let allEntities = useStoryStore.getState().entities;
  if (allEntities.length === 0 || allEntities.some(e => e.projectId !== projectId)) {
    allEntities = await db.entities.where('projectId').equals(projectId).toArray();
  }

  const detectedEntities: Entity[] = [];
  const entityCounts = { characters: 0, locations: 0, magicSystems: 0 };

  for (const entity of allEntities) {
    const typeUpper = entity.type.toUpperCase();
    if (typeUpper === 'CHARACTER' || typeUpper === 'GEOGRAPHY' || typeUpper === 'LOCATION' || typeUpper === 'MAGIC_SYSTEM') {
      if (textLower.includes(entity.name.toLowerCase())) {
        detectedEntities.push(entity);
        if (typeUpper === 'CHARACTER') entityCounts.characters++;
        else if (typeUpper === 'GEOGRAPHY' || typeUpper === 'LOCATION') entityCounts.locations++;
        else if (typeUpper === 'MAGIC_SYSTEM') entityCounts.magicSystems++;
      }
    }
  }

  const rules = await db.entities
    .where('projectId')
    .equals(projectId)
    .filter(e => e.hasAIRule === true)
    .toArray();

  let systemPrompt = await buildBaseSystemPrompt(projectId, detectedEntities, rules);

  systemPrompt += `[ACTION]\n`;
  systemPrompt += getActionInstruction(actionType) + `\n`;
  if (userInstruction && userInstruction.trim()) {
    systemPrompt += `Additional Instructions: ${userInstruction.trim()}\n`;
  }

  const contextSummary = `Context loaded: ${entityCounts.characters} characters, ${entityCounts.locations} locations, ${entityCounts.magicSystems} magic systems, ${rules.length} AI rules.`;

  const t1 = performance.now();
  if (import.meta.env.DEV && (t1 - t0) > 100) {
    console.warn(`[promptEngine] buildPrompt took ${(t1 - t0).toFixed(2)}ms`);
  }

  return { systemPrompt, contextSummary };
}

export async function buildAssistantPrompt({
  projectId,
  forcedEntities
}: AssistantPromptParams): Promise<PromptEngineResult> {
  const rules = await db.entities
    .where('projectId')
    .equals(projectId)
    .filter(e => e.hasAIRule === true)
    .toArray();

  let systemPrompt = await buildBaseSystemPrompt(projectId, forcedEntities, rules);

  systemPrompt += `[ACTION]\nYou are acting as a world-building assistant. Answer the user's questions, expand on lore, or generate new content based on the attached context and project rules. Provide rich, detailed, and engaging responses.`;

  const contextSummary = `Assistant Context: attached ${forcedEntities.length} entities, ${rules.length} AI rules.`;

  return { systemPrompt, contextSummary };
}
