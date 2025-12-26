import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import {
  ArrowLeft, Save, Download, Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo,
  Moon, Sun, Clock, Printer, Copy, Scissors, ClipboardPaste, Search,
  ZoomIn, ZoomOut, FileDown, FilePlus, Share2, HelpCircle, Type, Strikethrough,
  Link2, Image, Table, Minus, MoreHorizontal, Highlighter, Home, FileInput,
  LayoutGrid, Eye, BookOpen, Sparkles, ChevronDown, Replace
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const FONT_FAMILIES = [
  "Calibri", "Arial", "Times New Roman", "Georgia", "Verdana", "Tahoma",
  "Trebuchet MS", "Courier New", "Comic Sans MS", "Impact"
];

const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "22", "24", "26", "28", "36", "48", "72"];

const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
];

export default function NeuroDocs() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Document1");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [zoom, setZoom] = useState(100);
  const [fontFamily, setFontFamily] = useState("Calibri");
  const [fontSize, setFontSize] = useState("11");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [pageCount, setPageCount] = useState(1);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[1056px] w-full",
        style: `font-family: ${fontFamily}, sans-serif; font-size: ${fontSize}pt;`,
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
      setCharCount(text.length);
      setPageCount(Math.max(1, Math.ceil(text.length / 3000)));
    },
  });

  useEffect(() => {
    setCurrentTool("docs");
    
    const saved = localStorage.getItem("neuroadapt-docs-current");
    if (saved) {
      const doc: Document = JSON.parse(saved);
      setTitle(doc.title);
      editor?.commands.setContent(doc.content);
      setLastSaved(new Date(doc.updatedAt));
    }

    return () => setCurrentTool(null);
  }, [setCurrentTool, editor]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (editor) handleSave(true);
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
    
    if (!silent) toast.success("Document saved!");
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

  const handleExportDOCX = useCallback(() => {
    if (!editor) return;
    
    const html = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset='utf-8'><title>${title}</title></head>
<body style="font-family: Calibri, sans-serif;">${editor.getHTML()}</body>
</html>`;
    
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Document exported!");
  }, [editor, title]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleNewDocument = () => {
    if (confirm("Create a new document? Unsaved changes will be lost.")) {
      editor?.commands.setContent("");
      setTitle("Document1");
      setLastSaved(null);
      localStorage.removeItem("neuroadapt-docs-current");
    }
  };

  if (!editor) return null;

  return (
    <>
      <Helmet>
        <title>{title} - NeuroDocs</title>
      </Helmet>
      <BreakReminder />

      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#1e1e1e] flex flex-col">
        {/* Title Bar - Word Style */}
        <div className="h-8 bg-[#2b579a] dark:bg-[#1e3a5f] flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#2b579a] font-bold text-[10px]">W</span>
              </div>
              <span className="text-white text-xs font-medium">{title} - NeuroDocs</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1">
              <Share2 className="w-3 h-3" />
              Share
            </Button>
            <div className="flex items-center gap-1 text-white/70 text-xs mx-2">
              <Clock className="w-3 h-3" />
              <span>{formatTime(currentToolTime)}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* Quick Access Toolbar */}
        <div className="h-7 bg-[#2b579a] dark:bg-[#1e3a5f] flex items-center px-2 gap-0.5 border-b border-[#1e3f6e]">
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10" onClick={() => handleSave(false)}>
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10" onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10" onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-3 h-3" />
          </Button>
        </div>

        {/* Menu Bar */}
        <div className="h-7 bg-white dark:bg-[#2d2d2d] flex items-center px-1 border-b border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e5f1fb] dark:hover:bg-gray-700">File</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem onClick={handleNewDocument}>
                <FilePlus className="w-4 h-4 mr-3" /> New <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.getElementById("file-open")?.click()}>
                <FileInput className="w-4 h-4 mr-3" /> Open <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleSave(false)}>
                <Save className="w-4 h-4 mr-3" /> Save <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><FileDown className="w-4 h-4 mr-3" /> Export As</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={handleExportPDF}>PDF Document (.pdf)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportDOCX}>Word Document (.doc)</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-3" /> Print <span className="ml-auto text-xs text-muted-foreground">Ctrl+P</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e5f1fb] dark:hover:bg-gray-700">Edit</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => editor.chain().focus().undo().run()}>
                <Undo className="w-4 h-4 mr-3" /> Undo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editor.chain().focus().redo().run()}>
                <Redo className="w-4 h-4 mr-3" /> Redo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => document.execCommand("cut")}>
                <Scissors className="w-4 h-4 mr-3" /> Cut <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand("copy")}>
                <Copy className="w-4 h-4 mr-3" /> Copy <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.execCommand("paste")}>
                <ClipboardPaste className="w-4 h-4 mr-3" /> Paste <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Search className="w-4 h-4 mr-3" /> Find <span className="ml-auto text-xs text-muted-foreground">Ctrl+F</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Replace className="w-4 h-4 mr-3" /> Replace <span className="ml-auto text-xs text-muted-foreground">Ctrl+H</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e5f1fb] dark:hover:bg-gray-700">View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="w-4 h-4 mr-3" /> Zoom In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-4 h-4 mr-3" /> Zoom Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom(100)}>
                <Eye className="w-4 h-4 mr-3" /> 100%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e5f1fb] dark:hover:bg-gray-700">Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem><Table className="w-4 h-4 mr-3" /> Table</DropdownMenuItem>
              <DropdownMenuItem><Image className="w-4 h-4 mr-3" /> Picture</DropdownMenuItem>
              <DropdownMenuItem><Link2 className="w-4 h-4 mr-3" /> Link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()}>
                <Minus className="w-4 h-4 mr-3" /> Horizontal Line
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e5f1fb] dark:hover:bg-gray-700">Help</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem><HelpCircle className="w-4 h-4 mr-3" /> Help</DropdownMenuItem>
              <DropdownMenuItem><Sparkles className="w-4 h-4 mr-3" /> What's New</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />
          <span className="text-xs text-muted-foreground mr-2">
            {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Not saved"}
          </span>
        </div>

        {/* Ribbon Tabs */}
        <div className="bg-white dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8 bg-transparent border-b border-gray-200 dark:border-gray-700 rounded-none p-0 gap-0">
              <TabsTrigger value="home" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#2b579a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Home className="w-3 h-3 mr-1" /> Home
              </TabsTrigger>
              <TabsTrigger value="insert" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#2b579a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <LayoutGrid className="w-3 h-3 mr-1" /> Insert
              </TabsTrigger>
              <TabsTrigger value="layout" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#2b579a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <BookOpen className="w-3 h-3 mr-1" /> Layout
              </TabsTrigger>
              <TabsTrigger value="review" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#2b579a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Eye className="w-3 h-3 mr-1" /> Review
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Ribbon Content */}
          <div className="h-24 bg-[#f3f3f3] dark:bg-[#2d2d2d] px-2 py-1 flex items-start gap-4">
            {/* Clipboard Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-0.5 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => navigator.clipboard.readText().then(t => editor.commands.insertContent(t))}>
                  <ClipboardPaste className="w-5 h-5 text-[#2b579a]" />
                  <span className="text-[9px]">Paste</span>
                </Button>
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => document.execCommand("cut")}>
                    <Scissors className="w-3 h-3 mr-1" /> Cut
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => document.execCommand("copy")}>
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Clipboard</span>
            </div>

            {/* Font Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-1 mb-1">
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="h-6 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map(f => (
                      <SelectItem key={f} value={f} style={{ fontFamily: f }}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="h-6 w-14 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_SIZES.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-0.5">
                <Button variant={editor.isActive("bold") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleBold().run()}>
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive("italic") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleItalic().run()}>
                  <Italic className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive("underline") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive("strike") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleStrike().run()}>
                  <Strikethrough className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-0.5" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700">
                      <Highlighter className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    <div className="grid grid-cols-10 gap-0.5">
                      {COLORS.map(color => (
                        <button key={color} className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-125 transition-transform" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700">
                      <Type className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    <div className="grid grid-cols-10 gap-0.5">
                      {COLORS.map(color => (
                        <button key={color} className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-125 transition-transform" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Font</span>
            </div>

            {/* Paragraph Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5 mb-1">
                <Button variant={editor.isActive("bulletList") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                  <List className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive("orderedList") ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                  <ListOrdered className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex gap-0.5">
                <Button variant={editor.isActive({ textAlign: "left" }) ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive({ textAlign: "center" }) ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
                <Button variant={editor.isActive({ textAlign: "right" }) ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e5f1fb] dark:hover:bg-gray-700" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>
                  <AlignJustify className="w-3.5 h-3.5" />
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Paragraph</span>
            </div>

            {/* Styles Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-1">
                <button onClick={() => editor.chain().focus().setParagraph().run()} className={`h-14 w-14 border rounded text-xs flex flex-col items-center justify-center hover:bg-[#e5f1fb] dark:hover:bg-gray-700 ${!editor.isActive("heading") ? "border-[#2b579a] bg-[#e5f1fb]" : "border-gray-300"}`}>
                  <span className="text-[11px]">Normal</span>
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`h-14 w-14 border rounded text-xs flex flex-col items-center justify-center hover:bg-[#e5f1fb] dark:hover:bg-gray-700 ${editor.isActive("heading", { level: 1 }) ? "border-[#2b579a] bg-[#e5f1fb]" : "border-gray-300"}`}>
                  <span className="text-lg font-bold text-[#2b579a]">Aa</span>
                  <span className="text-[9px]">Heading 1</span>
                </button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`h-14 w-14 border rounded text-xs flex flex-col items-center justify-center hover:bg-[#e5f1fb] dark:hover:bg-gray-700 ${editor.isActive("heading", { level: 2 }) ? "border-[#2b579a] bg-[#e5f1fb]" : "border-gray-300"}`}>
                  <span className="text-base font-bold text-[#2b579a]">Aa</span>
                  <span className="text-[9px]">Heading 2</span>
                </button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Styles</span>
            </div>

            {/* Editing Group */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e5f1fb] dark:hover:bg-gray-700">
                  <Search className="w-3 h-3 mr-1" /> Find
                </Button>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e5f1fb] dark:hover:bg-gray-700">
                  <Replace className="w-3 h-3 mr-1" /> Replace
                </Button>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e5f1fb] dark:hover:bg-gray-700">
                  <MoreHorizontal className="w-3 h-3 mr-1" /> Select
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Editing</span>
            </div>
          </div>
        </div>

        {/* Ruler */}
        <div className="h-6 bg-white dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <div className="w-[816px] h-4 bg-[#f8f8f8] dark:bg-[#3d3d3d] relative">
            {Array.from({ length: 17 }, (_, i) => (
              <div key={i} className="absolute top-0 h-full flex flex-col justify-end" style={{ left: `${i * 48}px` }}>
                <div className="w-px h-2 bg-gray-400" />
                <span className="text-[8px] text-gray-500 -ml-1">{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Document Area */}
        <main className="flex-1 overflow-auto bg-[#e0e0e0] dark:bg-[#1a1a1a] py-4 print:bg-white print:p-0">
          <div 
            className="mx-auto bg-white dark:bg-[#1e1e1e] shadow-lg print:shadow-none"
            style={{ 
              width: `${816 * (zoom / 100)}px`,
              minHeight: `${1056 * (zoom / 100)}px`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center"
            }}
          >
            <div className="p-16 print:p-8" style={{ fontFamily: `${fontFamily}, sans-serif`, fontSize: `${fontSize}pt` }}>
              <EditorContent editor={editor} className="prose prose-sm dark:prose-invert max-w-none focus:outline-none" />
            </div>
          </div>
        </main>

        {/* Status Bar */}
        <footer className="h-6 bg-[#2b579a] dark:bg-[#1e3a5f] flex items-center justify-between px-3 text-white text-xs">
          <div className="flex items-center gap-4">
            <span>Page {pageCount} of {pageCount}</span>
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
          <div className="flex items-center gap-2">
            <span>English (US)</span>
            <div className="flex items-center gap-1 ml-4">
              <Button variant="ghost" size="icon" className="h-4 w-4 text-white/70 hover:text-white" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-3 h-3" />
              </Button>
              <input 
                type="range" 
                min="50" 
                max="200" 
                value={zoom} 
                onChange={(e) => setZoom(parseInt(e.target.value))}
                className="w-20 h-1 accent-white"
              />
              <Button variant="ghost" size="icon" className="h-4 w-4 text-white/70 hover:text-white" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center">{zoom}%</span>
            </div>
          </div>
        </footer>
      </div>

      <input type="file" id="file-open" accept=".txt,.html" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            editor.commands.setContent(event.target?.result as string);
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
          };
          reader.readAsText(file);
        }
      }} />
    </>
  );
}
