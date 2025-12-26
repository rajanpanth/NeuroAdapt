import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  ArrowLeft, Save, Download, FileText, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Undo, Redo,
  Heading1, Heading2, Heading3, Moon, Sun, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useProductivity } from "@/hooks/use-productivity";
import { BreakReminder } from "@/components/BreakReminder";
import jsPDF from "jspdf";

interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function NeuroDocs() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Untitled Document");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Start writing your document...</p>",
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none min-h-[500px] max-w-none p-8",
      },
    },
  });

  useEffect(() => {
    setCurrentTool("docs");
    
    // Load saved document
    const saved = localStorage.getItem("neuroadapt-docs-current");
    if (saved) {
      const doc: Document = JSON.parse(saved);
      setTitle(doc.title);
      editor?.commands.setContent(doc.content);
      setLastSaved(new Date(doc.updatedAt));
    }

    return () => setCurrentTool(null);
  }, [setCurrentTool, editor]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) {
        handleSave(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [editor, title]);

  const handleSave = useCallback((silent = false) => {
    if (!editor) return;
    
    setIsSaving(true);
    const doc: Document = {
      id: "current",
      title,
      content: editor.getHTML(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("neuroadapt-docs-current", JSON.stringify(doc));
    setLastSaved(new Date());
    setIsSaving(false);
    
    if (!silent) {
      toast.success("Document saved!");
    }
  }, [editor, title]);

  const handleExportPDF = useCallback(() => {
    if (!editor) return;
    
    const pdf = new jsPDF();
    const text = editor.getText();
    const lines = pdf.splitTextToSize(text, 180);
    
    pdf.setFontSize(20);
    pdf.text(title, 15, 20);
    pdf.setFontSize(12);
    pdf.text(lines, 15, 35);
    pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
    
    toast.success("PDF exported!");
  }, [editor, title]);

  const handleExportHTML = useCallback(() => {
    if (!editor) return;
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
  </style>
</head>
<body>
  <h1>${title}</h1>
  ${editor.getHTML()}
</body>
</html>`;
    
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("HTML exported!");
  }, [editor, title]);

  if (!editor) return null;

  return (
    <>
      <Helmet>
        <title>{title} | NeuroDocs</title>
      </Helmet>
      <BreakReminder />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none bg-transparent text-lg font-semibold h-auto p-0 focus-visible:ring-0"
                  placeholder="Untitled Document"
                />
                <p className="text-xs text-muted-foreground">
                  {lastSaved ? `Last saved ${lastSaved.toLocaleTimeString()}` : "Not saved yet"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentToolTime)}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleSave(false)} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportHTML}>
                <Download className="w-4 h-4 mr-2" />
                HTML
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-t border-border/30 flex-wrap">
            <Button
              variant={editor.isActive("heading", { level: 1 }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant={editor.isActive("bold") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("italic") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("underline") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"}
              size="icon"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Editor */}
        <main className="flex-1 bg-muted/20">
          <div className="max-w-4xl mx-auto py-8">
            <div className="bg-background rounded-lg shadow-lg border border-border/50 min-h-[600px]">
              <EditorContent editor={editor} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
