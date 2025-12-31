import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  List,
  Quote,
  BookOpen,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReferencesTabProps {
  editor: Editor;
}

export const ReferencesTab = ({ editor }: ReferencesTabProps) => {
  const handleInsertFootnote = () => {
    // Insert a superscript number as a simple footnote
    const footnoteNumber = '[1]';
    editor.chain().focus().insertContent(`<sup>${footnoteNumber}</sup>`).run();
    toast({
      title: 'Footnote inserted',
      description: 'Add your footnote text at the bottom of the page.',
    });
  };

  const handleInsertEndnote = () => {
    const endnoteNumber = '[i]';
    editor.chain().focus().insertContent(`<sup>${endnoteNumber}</sup>`).run();
    toast({
      title: 'Endnote inserted',
      description: 'Add your endnote text at the end of the document.',
    });
  };

  const handleInsertCitation = () => {
    const citation = '(Author, Year)';
    editor.chain().focus().insertContent(citation).run();
  };

  const handleInsertTableOfContents = () => {
    // Get all headings from the document
    const content = editor.getHTML();
    const headingRegex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
    const headings: { level: number; text: string }[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, ''), // Strip HTML tags
      });
    }

    if (headings.length === 0) {
      toast({
        title: 'No headings found',
        description: 'Add headings (H1, H2, H3) to your document first.',
        variant: 'destructive',
      });
      return;
    }

    // Create TOC HTML
    let tocHtml = '<div style="margin-bottom: 1rem;"><strong>Table of Contents</strong></div><ul>';
    headings.forEach((heading) => {
      const indent = (heading.level - 1) * 20;
      tocHtml += `<li style="margin-left: ${indent}px;">${heading.text}</li>`;
    });
    tocHtml += '</ul><hr/>';

    editor.chain().focus().insertContent(tocHtml).run();
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Footnotes */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={handleInsertFootnote}
          title="Insert Footnote"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Footnote</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Endnotes */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={handleInsertEndnote}
          title="Insert Endnote"
        >
          <BookOpen className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Endnote</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Citations */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={handleInsertCitation}
          title="Insert Citation"
        >
          <Quote className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Citation</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Table of Contents */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={handleInsertTableOfContents}
          title="Insert Table of Contents"
        >
          <List className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Contents</span>
      </div>
    </div>
  );
};
