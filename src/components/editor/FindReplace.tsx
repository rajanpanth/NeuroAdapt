import { useState, useCallback, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ChevronUp, ChevronDown, Replace } from 'lucide-react';

interface FindReplaceProps {
  editor: Editor | null;
  onClose: () => void;
}

export const FindReplace = ({ editor, onClose }: FindReplaceProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);

  const findMatches = useCallback(() => {
    if (!editor || !searchTerm) {
      setMatchCount(0);
      setCurrentMatch(0);
      return;
    }

    const text = editor.getText();
    const regex = new RegExp(searchTerm, 'gi');
    const matches = text.match(regex);
    setMatchCount(matches ? matches.length : 0);
    if (matches && matches.length > 0 && currentMatch === 0) {
      setCurrentMatch(1);
    }
  }, [editor, searchTerm, currentMatch]);

  useEffect(() => {
    findMatches();
  }, [searchTerm, findMatches]);

  const handleFindNext = () => {
    if (!editor || !searchTerm) return;
    
    // Use browser's native find functionality
    const windowWithFind = window as Window & { find?: (str: string, caseSensitive?: boolean, backwards?: boolean, wrapAround?: boolean, wholeWord?: boolean, searchInFrames?: boolean, showDialog?: boolean) => boolean };
    if (windowWithFind.find) {
      windowWithFind.find(searchTerm, false, false, true, false, true, false);
    }
    
    if (currentMatch < matchCount) {
      setCurrentMatch(currentMatch + 1);
    } else {
      setCurrentMatch(1);
    }
  };

  const handleFindPrevious = () => {
    if (!editor || !searchTerm) return;
    
    const windowWithFind = window as Window & { find?: (str: string, caseSensitive?: boolean, backwards?: boolean, wrapAround?: boolean, wholeWord?: boolean, searchInFrames?: boolean, showDialog?: boolean) => boolean };
    if (windowWithFind.find) {
      windowWithFind.find(searchTerm, false, true, true, false, true, false);
    }
    
    if (currentMatch > 1) {
      setCurrentMatch(currentMatch - 1);
    } else {
      setCurrentMatch(matchCount);
    }
  };

  const handleReplace = () => {
    if (!editor || !searchTerm) return;
    
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to);
    
    if (selectedText.toLowerCase() === searchTerm.toLowerCase()) {
      editor.chain().focus().deleteSelection().insertContent(replaceTerm).run();
      handleFindNext();
    } else {
      handleFindNext();
    }
  };

  const handleReplaceAll = () => {
    if (!editor || !searchTerm) return;
    
    const content = editor.getHTML();
    const regex = new RegExp(searchTerm, 'gi');
    const newContent = content.replace(regex, replaceTerm);
    editor.commands.setContent(newContent);
    setMatchCount(0);
    setCurrentMatch(0);
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/50">
      <div className="flex items-center gap-2 flex-1">
        <Input
          placeholder="Find..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 w-48"
          autoFocus
        />
        <span className="text-sm text-muted-foreground min-w-[60px]">
          {matchCount > 0 ? `${currentMatch}/${matchCount}` : 'No results'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFindPrevious}
          disabled={matchCount === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFindNext}
          disabled={matchCount === 0}
          className="h-8 w-8 p-0"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Replace..."
          value={replaceTerm}
          onChange={(e) => setReplaceTerm(e.target.value)}
          className="h-8 w-48"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReplace}
          disabled={matchCount === 0}
          className="h-8"
        >
          Replace
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReplaceAll}
          disabled={matchCount === 0}
          className="h-8"
        >
          Replace All
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
