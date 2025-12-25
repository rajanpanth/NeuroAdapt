import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { X, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  replies: { author: string; text: string; timestamp: Date }[];
}

interface CommentsPanelProps {
  onClose: () => void;
}

export const CommentsPanel = ({ onClose }: CommentsPanelProps) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'You',
      text: 'This section needs more detail.',
      timestamp: new Date(Date.now() - 3600000),
      replies: [],
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          author: 'You',
          text: newComment,
          timestamp: new Date(),
          replies: [],
        },
      ]);
      setNewComment('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-72 border-l border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium text-sm">Comments</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{comment.author}</span>
                <span className="text-[10px] text-muted-foreground">
                  {formatTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-xs text-foreground">{comment.text}</p>
              {comment.replies.map((reply, idx) => (
                <div key={idx} className="ml-3 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium">{reply.author}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime(reply.timestamp)}
                    </span>
                  </div>
                  <p className="text-[10px]">{reply.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[60px] text-xs resize-none"
          />
        </div>
        <Button
          size="sm"
          className="mt-2 w-full text-xs"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send className="h-3 w-3 mr-1" />
          Add Comment
        </Button>
      </div>
    </div>
  );
};
