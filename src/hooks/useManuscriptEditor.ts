import { Editor } from '@tiptap/react';

// Global singleton reference to the active manuscript editor
const editorRef: { current: Editor | null } = { current: null };

export const useManuscriptEditor = () => {
  return {
    editor: editorRef.current,
    setEditor: (editor: Editor | null) => {
      editorRef.current = editor;
    }
  };
};

export const getManuscriptEditor = () => editorRef.current;
