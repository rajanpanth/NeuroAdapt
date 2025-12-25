import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  FileText,
  Square,
  Rows3,
  IndentIncrease,
  IndentDecrease,
} from 'lucide-react';

interface PageLayoutTabProps {
  editor: Editor;
  pageSize: 'a4' | 'letter';
  onPageSizeChange: (size: 'a4' | 'letter') => void;
  margins: 'normal' | 'narrow' | 'wide';
  onMarginsChange: (margins: 'normal' | 'narrow' | 'wide') => void;
  orientation: 'portrait' | 'landscape';
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
}

const lineSpacingOptions = [
  { value: '1', label: 'Single' },
  { value: '1.15', label: '1.15' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: 'Double' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: 'Triple' },
];

export const PageLayoutTab = ({
  editor,
  pageSize,
  onPageSizeChange,
  margins,
  onMarginsChange,
  orientation,
  onOrientationChange,
}: PageLayoutTabProps) => {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Page Size */}
      <div className="flex flex-col items-center gap-0.5">
        <Select value={pageSize} onValueChange={(value: 'a4' | 'letter') => onPageSizeChange(value)}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a4">A4</SelectItem>
            <SelectItem value="letter">Letter</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">Size</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Margins */}
      <div className="flex flex-col items-center gap-0.5">
        <Select value={margins} onValueChange={(value: 'normal' | 'narrow' | 'wide') => onMarginsChange(value)}>
          <SelectTrigger className="w-[100px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="narrow">Narrow</SelectItem>
            <SelectItem value="wide">Wide</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">Margins</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Orientation */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant={orientation === 'portrait' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onOrientationChange('portrait')}
            title="Portrait"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant={orientation === 'landscape' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={() => onOrientationChange('landscape')}
            title="Landscape"
          >
            <FileText className="h-4 w-4 rotate-90" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Orientation</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Indentation */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            title="Decrease Indent"
          >
            <IndentDecrease className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            title="Increase Indent"
          >
            <IndentIncrease className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Indent</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Line Spacing */}
      <div className="flex flex-col items-center gap-0.5">
        <Select defaultValue="1.5">
          <SelectTrigger className="w-[80px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {lineSpacingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">Spacing</span>
      </div>
    </div>
  );
};
