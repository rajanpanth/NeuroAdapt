import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X, History, RotateCcw } from 'lucide-react';

interface VersionHistoryPanelProps {
  onClose: () => void;
  onRestore: (versionId: string) => void;
}

interface Version {
  id: string;
  timestamp: Date;
  description: string;
}

export const VersionHistoryPanel = ({ onClose, onRestore }: VersionHistoryPanelProps) => {
  // Mock version history data
  const versions: Version[] = [
    {
      id: '1',
      timestamp: new Date(),
      description: 'Current version',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      description: 'Added introduction section',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      description: 'Initial draft',
    },
  ];

  const formatDateTime = (date: Date) => {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-64 border-l border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4" />
          <span className="font-medium text-sm">Version History</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-3 rounded-lg border transition-colors ${
                index === 0
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  {formatDateTime(version.timestamp)}
                </span>
                {index !== 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRestore(version.id)}
                    title="Restore this version"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{version.description}</p>
              {index === 0 && (
                <span className="text-[10px] text-primary font-medium">Current</span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
