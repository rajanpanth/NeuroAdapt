import { Document } from '@/types/document';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DocumentCard = ({ document, onOpen, onDelete }: DocumentCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(document.id);
  };

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
      onClick={() => onOpen(document.id)}
    >
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-background border-b border-border flex items-center justify-center relative overflow-hidden">
          <FileText className="h-16 w-16 text-muted" />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-card/80 backdrop-blur-sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-1 p-3">
        <h3 className="font-medium text-sm line-clamp-1">{document.title}</h3>
        <p className="text-xs text-muted-foreground">
          Edited {formatDistanceToNow(document.updatedAt, { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
};
