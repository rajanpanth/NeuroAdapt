import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ZoomIn,
  ZoomOut,
  FileText,
  Globe,
  Moon,
  Sun,
  Ruler,
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface ViewTabProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showRulers: boolean;
  onToggleRulers: () => void;
}

export const ViewTab = ({
  zoom,
  onZoomChange,
  showRulers,
  onToggleRulers,
}: ViewTabProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Zoom Controls */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onZoomChange(Math.max(50, zoom - 10))}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-[100px]">
            <Slider
              value={[zoom]}
              min={50}
              max={200}
              step={10}
              onValueChange={(value) => onZoomChange(value[0])}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onZoomChange(Math.min(200, zoom + 10))}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10">{zoom}%</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Zoom</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-2" />

      {/* View Modes */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8"
            title="Print Layout"
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            title="Web Layout"
          >
            <Globe className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Layout</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-2" />

      {/* Dark Mode Toggle */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <span className="text-[10px] text-muted-foreground">Theme</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-2" />

      {/* Rulers Toggle */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-2 h-10">
          <Switch
            id="rulers"
            checked={showRulers}
            onCheckedChange={onToggleRulers}
          />
          <Label htmlFor="rulers" className="text-xs flex items-center gap-1">
            <Ruler className="h-4 w-4" />
          </Label>
        </div>
        <span className="text-[10px] text-muted-foreground">Rulers</span>
      </div>
    </div>
  );
};
