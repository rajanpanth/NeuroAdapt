import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Paintbrush,
  Type,
  RemoveFormatting,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeTabProps {
  editor: Editor;
}

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
];

const fontSizes = [
  '8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'
];

const textColors = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
];

const highlightColors = [
  '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ff0000', '#0000ff', '#ff9900', '#9900ff',
];

export const HomeTab = ({ editor }: HomeTabProps) => {
  const getCurrentFontFamily = () => {
    const attrs = editor.getAttributes('textStyle');
    return attrs.fontFamily || 'Inter';
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Font Family */}
      <div className="flex flex-col items-center gap-0.5">
        <Select
          value={getCurrentFontFamily()}
          onValueChange={(value) => editor.chain().focus().setFontFamily(value).run()}
        >
          <SelectTrigger className="w-[120px] h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">Font</span>
      </div>

      {/* Font Size */}
      <div className="flex flex-col items-center gap-0.5">
        <Select
          value="12"
          onValueChange={(value) => {
            editor.chain().focus().run();
          }}
        >
          <SelectTrigger className="w-[60px] h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[10px] text-muted-foreground">Size</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Text Formatting */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('bold') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('italic') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('underline') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('strike') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Format</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Text Color */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Text Color">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="grid grid-cols-10 gap-1">
                {textColors.map((color) => (
                  <button
                    key={color}
                    className="w-4 h-4 rounded-sm border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" title="Highlight">
                <Paintbrush className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2">
              <div className="grid grid-cols-4 gap-1">
                {highlightColors.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-sm border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <span className="text-[10px] text-muted-foreground">Colors</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Alignment */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive({ textAlign: 'left' }) && 'bg-accent')}
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive({ textAlign: 'center' }) && 'bg-accent')}
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive({ textAlign: 'right' }) && 'bg-accent')}
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive({ textAlign: 'justify' }) && 'bg-accent')}
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Alignment</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Lists */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('bulletList') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-7 w-7', editor.isActive('orderedList') && 'bg-accent')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-[10px] text-muted-foreground">Lists</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Clear Formatting */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Clear</span>
      </div>
    </div>
  );
};
