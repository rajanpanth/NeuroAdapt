import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Image,
  Table,
  Link,
  Smile,
  Minus,
  FileText,
} from 'lucide-react';
import { useState, useRef } from 'react';

interface InsertTabProps {
  editor: Editor;
}

const emojis = ['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '⭐', '✅', '❌', '🎉', '🔥', '💡', '📌', '📝', '✨'];

export const InsertTab = ({ editor }: InsertTabProps) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInsertLink = () => {
    if (linkUrl) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImageUrl = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Image */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => fileInputRef.current?.click()}
            title="Insert Image"
          >
            <Image className="h-5 w-5" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                URL
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insert Image from URL</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <Button onClick={handleInsertImageUrl}>Insert</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <span className="text-[10px] text-muted-foreground">Image</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Table */}
      <div className="flex flex-col items-center gap-0.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" title="Insert Table">
              <Table className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="w-12 text-xs">Rows:</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={tableRows}
                  onChange={(e) => setTableRows(Number(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="w-12 text-xs">Cols:</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={tableCols}
                  onChange={(e) => setTableCols(Number(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
              <Button size="sm" className="w-full text-xs" onClick={handleInsertTable}>
                Insert Table
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-[10px] text-muted-foreground">Table</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Hyperlink */}
      <div className="flex flex-col items-center gap-0.5">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" title="Insert Link">
              <Link className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Hyperlink</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>URL</Label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label>Text (optional)</Label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Link text"
                />
              </div>
              <Button onClick={handleInsertLink}>Insert Link</Button>
            </div>
          </DialogContent>
        </Dialog>
        <span className="text-[10px] text-muted-foreground">Link</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Emoji */}
      <div className="flex flex-col items-center gap-0.5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" title="Insert Emoji">
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  className="w-6 h-6 hover:bg-accent rounded text-sm"
                  onClick={() => editor.chain().focus().insertContent(emoji).run()}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <span className="text-[10px] text-muted-foreground">Emoji</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Horizontal Line */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Line"
        >
          <Minus className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Line</span>
      </div>

      <Separator orientation="vertical" className="h-12 mx-1" />

      {/* Page Break */}
      <div className="flex flex-col items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          title="Page Break"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <span className="text-[10px] text-muted-foreground">Break</span>
      </div>
    </div>
  );
};
