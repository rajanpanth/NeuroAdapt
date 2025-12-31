import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '@/hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Check, Cloud, Users, FileText, Menu, Download, Printer, FolderOpen, FilePlus, Save } from 'lucide-react';
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
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
import { RibbonToolbar } from '@/components/editor/ribbon/RibbonToolbar';
import { PageView } from '@/components/editor/PageView';
import { CommentsPanel } from '@/components/editor/panels/CommentsPanel';
import { DocumentOutlinePanel } from '@/components/editor/panels/DocumentOutlinePanel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { exportDocument, type ExportFormat } from '@/lib/fileExport';

const DocumentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDocument, updateDocument, documents } = useDocuments();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showRulers, setShowRulers] = useState(true);
  const [pageSize, setPageSize] = useState<'a4' | 'letter'>('a4');
  const [margins, setMargins] = useState<'normal' | 'narrow' | 'wide'>('normal');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const document = getDocument(id || '');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Placeholder.configure({ placeholder: 'Start typing your document...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-primary underline cursor-pointer' } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Subscript,
      Superscript,
      Image.configure({ inline: true, allowBase64: true }),
      FontFamily,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[800px]',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        handleContentChange(editor.getHTML());
      }, 500);
    },
  });

  useEffect(() => {
    if (!id || (!document && documents.length > 0)) {
      navigate('/');
      toast({ title: 'Document not found', variant: 'destructive' });
      return;
    }
    if (document) {
      setTitle(document.title);
      setContent(document.content);
      if (editor && document.content !== editor.getHTML()) {
        editor.commands.setContent(document.content);
      }
    }
  }, [id, document, documents.length, navigate, editor]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
    if (id) updateDocument(id, { title: newTitle });
  }, [id, updateDocument]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaving(true);
    if (id) {
      updateDocument(id, { content: newContent });
      setTimeout(() => { setIsSaving(false); setLastSaved(new Date()); }, 300);
    }
  }, [id, updateDocument]);

  const handleSaveFile = useCallback((format: ExportFormat) => {
    if (document) {
      try {
        exportDocument(document, format);
        toast({
          title: 'File saved',
          description: `Document exported as ${format.toUpperCase()} file successfully.`,
        });
      } catch (error) {
        toast({
          title: 'Export failed',
          description: 'Failed to export document. Please try again.',
          variant: 'destructive',
        });
      }
    }
  }, [document]);

  if (!document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Bar */}
      <header className="h-12 bg-card border-b border-border flex items-center px-3 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">File</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate('/')}>
              <FilePlus className="h-4 w-4 mr-2" /> New
            </DropdownMenuItem>
            <DropdownMenuItem><FolderOpen className="h-4 w-4 mr-2" /> Open</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Save className="h-4 w-4 mr-2" /> Save as
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleSaveFile('html')}>
                    <FileText className="h-4 w-4 mr-2" /> HTML Document
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSaveFile('txt')}>
                    <FileText className="h-4 w-4 mr-2" /> Plain Text
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSaveFile('md')}>
                    <FileText className="h-4 w-4 mr-2" /> Markdown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSaveFile('json')}>
                    <FileText className="h-4 w-4 mr-2" /> JSON
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem><Download className="h-4 w-4 mr-2" /> Export</DropdownMenuItem>
            <DropdownMenuItem><Printer className="h-4 w-4 mr-2" /> Print</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="max-w-[250px] font-medium border-transparent hover:border-input focus:border-input h-8"
          placeholder="Untitled Document"
        />

        <div className="flex items-center gap-1 ml-auto">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
            {isSaving ? (
              <><Cloud className="h-3 w-3 animate-pulse" /><span className="hidden sm:inline">Saving...</span></>
            ) : lastSaved ? (
              <><Check className="h-3 w-3 text-primary" /><span className="hidden sm:inline">Saved</span></>
            ) : null}
          </div>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">U</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Ribbon Toolbar */}
      <RibbonToolbar
        editor={editor}
        onToggleComments={() => setShowComments(!showComments)}
        onZoomChange={setZoom}
        zoom={zoom}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers(!showRulers)}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        margins={margins}
        onMarginsChange={setMargins}
        orientation={orientation}
        onOrientationChange={setOrientation}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Document Outline Panel */}
        {showOutline && <DocumentOutlinePanel editor={editor} onClose={() => setShowOutline(false)} />}

        {/* Editor Area */}
        <main className="flex-1 overflow-auto py-8 px-4">
          <PageView pageSize={pageSize} margins={margins} orientation={orientation} zoom={zoom}>
            <EditorContent editor={editor} />
          </PageView>
        </main>

        {/* Comments Panel */}
        {showComments && <CommentsPanel onClose={() => setShowComments(false)} />}
      </div>
    </div>
  );
};

export default DocumentPage;
