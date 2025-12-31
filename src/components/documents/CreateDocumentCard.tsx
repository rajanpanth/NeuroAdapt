import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

interface CreateDocumentCardProps {
  onCreate: () => void;
}

export const CreateDocumentCard = ({ onCreate }: CreateDocumentCardProps) => {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary group"
      onClick={onCreate}
    >
      <CardContent className="p-0">
        <div className="aspect-[4/3] bg-accent/30 border-b border-border flex flex-col items-center justify-center gap-3 group-hover:bg-accent/50 transition-colors">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Plus className="h-8 w-8 text-primary" />
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Blank Document
          </span>
        </div>
      </CardContent>
      <div className="p-3">
        <h3 className="font-medium text-sm">Create New</h3>
      </div>
    </Card>
  );
};
