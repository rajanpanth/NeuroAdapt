import { Editor } from '@tiptap/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, List } from 'lucide-react';

interface DocumentOutlinePanelProps {
  editor: Editor | null;
  onClose: () => void;
}

interface HeadingItem {
  level: number;
  text: string;
  pos: number;
}

export const DocumentOutlinePanel = ({ editor, onClose }: DocumentOutlinePanelProps) => {
  const getHeadings = (): HeadingItem[] => {
    if (!editor) return [];

    const headings: HeadingItem[] = [];
    const content = editor.getHTML();
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
    
    let match;
    let pos = 0;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, ''),
        pos: pos++,
      });
    }

    return headings;
  };

  const headings = getHeadings();

  const scrollToHeading = (text: string) => {
    if (!editor) return;
    
    // Find the heading node in the editor and scroll to it
    const content = editor.getHTML();
    const searchText = text.toLowerCase();
    
    // Focus the editor and search for the text
    editor.commands.focus();
  };

  return (
    <div className="w-56 border-l border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <List className="h-4 w-4" />
          <span className="font-medium text-sm">Outline</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        {headings.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No headings found. Add headings (H1-H6) to see the document outline.
          </p>
        ) : (
          <div className="space-y-1">
            {headings.map((heading, index) => (
              <button
                key={index}
                className="w-full text-left text-xs py-1.5 px-2 rounded hover:bg-accent transition-colors truncate"
                style={{ paddingLeft: `${(heading.level - 1) * 12 + 8}px` }}
                onClick={() => scrollToHeading(heading.text)}
              >
                <span className="text-muted-foreground mr-1">H{heading.level}</span>
                {heading.text}
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
