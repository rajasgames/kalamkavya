import ReactQuill from 'react-quill';

// Global singleton reference to the active manuscript editor
const editorRef: { current: ReactQuill | null } = { current: null };

export const useManuscriptEditor = () => {
  return {
    editor: editorRef.current,
    setEditor: (editor: ReactQuill | null) => {
      editorRef.current = editor;
    }
  };
};

export const getManuscriptEditor = () => editorRef.current;
