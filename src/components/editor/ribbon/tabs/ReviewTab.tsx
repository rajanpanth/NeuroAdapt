import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  SpellCheck,
  FileText,
  MessageSquare,
  Check,
  X,
  GitBranch,
} from 'lucide-react';
import { useState } from 'react';

interface ReviewTabProps {
  editor: Editor;
  onToggleComments: () => void;
}

export const ReviewTab = ({ editor, onToggleComments }: ReviewTabProps) => {
  const [trackChanges, setTrackChanges] = useState(false);

  const getWordCount = () => {
    const text = editor.getText();
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
  };

  const getCharCount = () => {
    return editor.getText().length;
  };

  const handleSpellCheck = () => {
    // Trigger browser's native spell check by focusing the editor
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      (editorElement as HTMLElement).focus();
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Spell Check */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={handleSpellCheck}
          title="Spell Check"
        >
          <SpellCheck className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Spelling</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Word Count */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-2 h-10 px-2">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-xs">
              {getWordCount()} words
            </Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {getCharCount()} chars
          </Badge>
        </div>
        <span className="text-[10px] text-muted-foreground">Count</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Track Changes */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant={trackChanges ? 'secondary' : 'ghost'}
          size="icon"
          className="h-10 w-10"
          onClick={() => setTrackChanges(!trackChanges)}
          title="Track Changes"
        >
          <GitBranch className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Track</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Comments */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={onToggleComments}
          title="Toggle Comments Panel"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Comments</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Accept/Reject Changes */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!trackChanges}
            title="Accept Change"
          >
            <Check className="h-4 w-4 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={!trackChanges}
            title="Reject Change"
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Changes</span>
      </div>
    </div>
  );
};
