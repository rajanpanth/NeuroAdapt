import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Image from '@tiptap/extension-image';
import FontFamily from '@tiptap/extension-font-family';
import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { WordCount } from './WordCount';
import { FindReplace } from './FindReplace';

interface DocumentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const DocumentEditor = ({ content, onContentChange }: DocumentEditorProps) => {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showFindReplace, setShowFindReplace] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Subscript,
      Superscript,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      FontFamily,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[calc(100vh-280px)] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        onContentChange(editor.getHTML());
      }, 500);
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowFindReplace(true);
      }
      if (e.key === 'Escape') {
        setShowFindReplace(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full bg-card rounded-lg shadow-md overflow-hidden">
      <EditorToolbar 
        editor={editor} 
        onToggleFindReplace={() => setShowFindReplace(!showFindReplace)}
      />
      {showFindReplace && (
        <FindReplace 
          editor={editor} 
          onClose={() => setShowFindReplace(false)} 
        />
      )}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
      <WordCount editor={editor} />
    </div>
  );
};
