import { Editor } from '@tiptap/react';

interface WordCountProps {
  editor: Editor | null;
}

export const WordCount = ({ editor }: WordCountProps) => {
  if (!editor) return null;

  const text = editor.getText();
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-sm text-muted-foreground">
      <span>Words: {words}</span>
      <span>Characters: {characters}</span>
      <span>Characters (no spaces): {charactersNoSpaces}</span>
    </div>
  );
};
