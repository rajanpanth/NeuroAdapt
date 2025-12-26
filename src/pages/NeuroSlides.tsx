import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Canvas as FabricCanvas, Rect, IText, FabricImage, Circle, Triangle, Line, Polygon } from "fabric";
import {
  ArrowLeft, Save, Download, Moon, Sun, Clock,
  Plus, Trash2, Play, Type, Square, Image as ImageIcon, ChevronLeft, ChevronRight,
  Copy, Scissors, ClipboardPaste, Undo, Redo, ZoomIn, ZoomOut,
  Printer, Share2, HelpCircle, Sparkles, Home, LayoutGrid, Eye,
  FileDown, FilePlus, Circle as CircleIcon, Triangle as TriangleIcon,
  Minus, ArrowRight, Star, Hexagon, Heart, FileInput, Palette, 
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  PanelTop, PanelBottom, Layers, Grid3X3, Move, MousePointer2, Presentation
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

interface Slide {
  id: string;
  objects: string;
  thumbnail?: string;
  layout?: string;
  notes?: string;
}

const THEMES = [
  { name: "Office", bg: "#ffffff", accent: "#4472c4", text: "#000000" },
  { name: "Dark", bg: "#1e1e1e", accent: "#4472c4", text: "#ffffff" },
  { name: "Blue", bg: "#1a365d", accent: "#63b3ed", text: "#ffffff" },
  { name: "Green", bg: "#1c4532", accent: "#68d391", text: "#ffffff" },
  { name: "Red", bg: "#742a2a", accent: "#fc8181", text: "#ffffff" },
  { name: "Purple", bg: "#44337a", accent: "#b794f4", text: "#ffffff" },
  { name: "Orange", bg: "#7b341e", accent: "#f6ad55", text: "#ffffff" },
  { name: "Teal", bg: "#234e52", accent: "#4fd1c5", text: "#ffffff" },
];

const LAYOUTS = [
  { name: "Title Slide", id: "title" },
  { name: "Title and Content", id: "title-content" },
  { name: "Two Content", id: "two-content" },
  { name: "Comparison", id: "comparison" },
  { name: "Content with Caption", id: "content-caption" },
  { name: "Blank", id: "blank" },
];

const SHAPES = [
  { name: "Rectangle", icon: Square },
  { name: "Circle", icon: CircleIcon },
  { name: "Triangle", icon: TriangleIcon },
  { name: "Line", icon: Minus },
  { name: "Arrow", icon: ArrowRight },
  { name: "Star", icon: Star },
];

const FONT_SIZES = ["8", "10", "12", "14", "16", "18", "20", "24", "28", "32", "36", "48", "60", "72", "96"];

const COLORS = [
  "#000000", "#ffffff", "#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5", "#70ad47",
  "#7030a0", "#c00000", "#00b0f0", "#00b050", "#002060", "#7f7f7f", "#ff0000", "#ffff00",
];

export default function NeuroSlides() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Presentation1");
  const [slides, setSlides] = useState<Slide[]>([{ id: "1", objects: "[]", layout: "title" }]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isPresenting, setIsPresenting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [zoom, setZoom] = useState(100);
  const [showNotes, setShowNotes] = useState(false);
  const [showGridlines, setShowGridlines] = useState(false);
  const [slideNotes, setSlideNotes] = useState("");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const presentationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTool("slides");
    
    const saved = localStorage.getItem("neuroadapt-slides-current");
    if (saved) {
      const presentation = JSON.parse(saved);
      setTitle(presentation.title);
      setSlides(presentation.slides);
      setSelectedTheme(presentation.theme || THEMES[0]);
      setLastSaved(new Date(presentation.updatedAt));
    }

    return () => setCurrentTool(null);
  }, [setCurrentTool]);

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current || isPresenting) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 960,
      height: 540,
      backgroundColor: selectedTheme.bg,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Load current slide objects
    const currentSlide = slides[currentSlideIndex];
    if (currentSlide?.objects && currentSlide.objects !== "[]") {
      try {
        canvas.loadFromJSON(currentSlide.objects, () => {
          canvas.renderAll();
        });
      } catch (e) {
        console.error("Error loading slide", e);
      }
    }

    // Set notes for current slide
    setSlideNotes(currentSlide?.notes || "");

    // Save on object modification
    const saveCurrentSlide = () => {
      const json = JSON.stringify(canvas.toJSON());
      setSlides((prev) => {
        const newSlides = [...prev];
        newSlides[currentSlideIndex] = {
          ...newSlides[currentSlideIndex],
          objects: json,
        };
        return newSlides;
      });
    };

    canvas.on("object:modified", saveCurrentSlide);
    canvas.on("object:added", saveCurrentSlide);
    canvas.on("object:removed", saveCurrentSlide);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [currentSlideIndex, selectedTheme, isPresenting]);

  // Update background when theme changes
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.backgroundColor = selectedTheme.bg;
      fabricCanvasRef.current.renderAll();
    }
  }, [selectedTheme]);

  const addTextBox = (preset?: "title" | "subtitle" | "body") => {
    if (!fabricCanvasRef.current) return;
    
    let options: any = {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: selectedTheme.text,
      fontFamily: "Calibri, sans-serif",
    };

    if (preset === "title") {
      options = { ...options, left: 50, top: 200, fontSize: 44, fontWeight: "bold", text: "Click to add title" };
    } else if (preset === "subtitle") {
      options = { ...options, left: 50, top: 280, fontSize: 28, text: "Click to add subtitle" };
    } else {
      options.text = "Click to edit text";
    }

    const text = new IText(options.text, options);
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  const addShape = (shapeType: string) => {
    if (!fabricCanvasRef.current) return;
    
    let shape: any;
    const baseProps = {
      left: 100,
      top: 100,
      fill: selectedTheme.accent + "40",
      stroke: selectedTheme.accent,
      strokeWidth: 2,
    };

    switch (shapeType) {
      case "Rectangle":
        shape = new Rect({ ...baseProps, width: 150, height: 100, rx: 0, ry: 0 });
        break;
      case "Circle":
        shape = new Circle({ ...baseProps, radius: 60 });
        break;
      case "Triangle":
        shape = new Triangle({ ...baseProps, width: 120, height: 100 });
        break;
      case "Line":
        shape = new Line([0, 0, 200, 0], { ...baseProps, fill: undefined, left: 100, top: 200 });
        break;
      case "Arrow":
        shape = new Polygon([
          { x: 0, y: 20 },
          { x: 150, y: 20 },
          { x: 150, y: 0 },
          { x: 200, y: 30 },
          { x: 150, y: 60 },
          { x: 150, y: 40 },
          { x: 0, y: 40 },
        ], { ...baseProps, left: 100, top: 200 });
        break;
      case "Star":
        const points = [];
        for (let i = 0; i < 10; i++) {
          const radius = i % 2 === 0 ? 50 : 25;
          const angle = (Math.PI / 5) * i - Math.PI / 2;
          points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
        }
        shape = new Polygon(points, { ...baseProps, left: 150, top: 150 });
        break;
      default:
        shape = new Rect({ ...baseProps, width: 150, height: 100 });
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !fabricCanvasRef.current) return;
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgUrl = event.target?.result as string;
        const img = await FabricImage.fromURL(imgUrl);
        img.scaleToWidth(300);
        fabricCanvasRef.current?.add(img);
        fabricCanvasRef.current?.setActiveObject(img);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObjects();
    active.forEach((obj) => fabricCanvasRef.current?.remove(obj));
    fabricCanvasRef.current.discardActiveObject();
  };

  const duplicateSelected = () => {
    if (!fabricCanvasRef.current) return;
    const active = fabricCanvasRef.current.getActiveObject();
    if (!active) return;
    
    active.clone((cloned: any) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
      fabricCanvasRef.current?.add(cloned);
      fabricCanvasRef.current?.setActiveObject(cloned);
    });
  };

  const addSlide = (layout?: string) => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      objects: "[]",
      layout: layout || "blank",
    };
    const newIndex = currentSlideIndex + 1;
    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides.splice(newIndex, 0, newSlide);
      return newSlides;
    });
    setCurrentSlideIndex(newIndex);
    toast.success("New slide added");
  };

  const deleteSlide = () => {
    if (slides.length <= 1) {
      toast.error("Cannot delete the only slide");
      return;
    }
    setSlides((prev) => prev.filter((_, i) => i !== currentSlideIndex));
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    toast.success("Slide deleted");
  };

  const duplicateSlide = () => {
    const currentSlide = slides[currentSlideIndex];
    const newSlide: Slide = {
      ...currentSlide,
      id: Date.now().toString(),
    };
    const newIndex = currentSlideIndex + 1;
    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides.splice(newIndex, 0, newSlide);
      return newSlides;
    });
    setCurrentSlideIndex(newIndex);
    toast.success("Slide duplicated");
  };

  const handleSave = useCallback(() => {
    // Save notes for current slide
    setSlides((prev) => {
      const newSlides = [...prev];
      newSlides[currentSlideIndex] = {
        ...newSlides[currentSlideIndex],
        notes: slideNotes,
      };
      return newSlides;
    });

    const presentation = {
      title,
      slides,
      theme: selectedTheme,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("neuroadapt-slides-current", JSON.stringify(presentation));
    setLastSaved(new Date());
    toast.success("Presentation saved!");
  }, [title, slides, selectedTheme, currentSlideIndex, slideNotes]);

  const handleExportPDF = useCallback(async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [960, 540] });
    
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) pdf.addPage([960, 540], "landscape");
      
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 960;
      tempCanvas.height = 540;
      const tempFabric = new FabricCanvas(tempCanvas, {
        width: 960,
        height: 540,
        backgroundColor: selectedTheme.bg,
      });
      
      if (slides[i].objects && slides[i].objects !== "[]") {
        await new Promise<void>((resolve) => {
          tempFabric.loadFromJSON(slides[i].objects, () => {
            tempFabric.renderAll();
            resolve();
          });
        });
      }
      
      const dataUrl = tempFabric.toDataURL({ format: "png", quality: 1, multiplier: 1 });
      pdf.addImage(dataUrl, "PNG", 0, 0, 960, 540);
      tempFabric.dispose();
    }
    
    pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF exported!");
  }, [slides, selectedTheme, title]);

  const handleExportPPTX = useCallback(() => {
    // Export as HTML that can be opened in PowerPoint
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; }
    .slide { width: 960px; height: 540px; page-break-after: always; position: relative; background: ${selectedTheme.bg}; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>`;

    for (let i = 0; i < slides.length; i++) {
      html += `<div class="slide" style="background-color: ${selectedTheme.bg};">
        <p style="color: ${selectedTheme.text};">Slide ${i + 1}</p>
      </div>`;
    }

    html += `</body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Presentation exported!");
  }, [title, slides, selectedTheme]);

  const startPresentation = (fromBeginning = true) => {
    if (fromBeginning) setCurrentSlideIndex(0);
    setIsPresenting(true);
    document.documentElement.requestFullscreen?.();
  };

  const exitPresentation = useCallback(() => {
    setIsPresenting(false);
    document.exitFullscreen?.();
  }, []);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation for presentation
  useEffect(() => {
    if (!isPresenting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") nextSlide();
      else if (e.key === "ArrowLeft" || e.key === "Backspace") prevSlide();
      else if (e.key === "Escape") exitPresentation();
      else if (e.key === "Home") setCurrentSlideIndex(0);
      else if (e.key === "End") setCurrentSlideIndex(slides.length - 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, currentSlideIndex, slides.length, exitPresentation]);

  if (isPresenting) {
    return (
      <div
        ref={presentationRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        onClick={nextSlide}
      >
        <div className="relative" style={{ backgroundColor: selectedTheme.bg, width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <canvas
            ref={canvasRef}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/70 px-6 py-3 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="min-w-[60px] text-center">{currentSlideIndex + 1} / {slides.length}</span>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-white/30" />
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); exitPresentation(); }}>
            End Show
          </Button>
        </div>
        <div className="absolute top-4 right-4 text-white/50 text-sm">
          Press Esc to exit
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} - NeuroSlides</title>
      </Helmet>
      <BreakReminder />

      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#1e1e1e] flex flex-col">
        {/* Title Bar - PowerPoint Style */}
        <div className="h-8 bg-[#b7472a] dark:bg-[#8b3520] flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#b7472a] font-bold text-[10px]">P</span>
              </div>
              <span className="text-white text-xs font-medium">{title} - NeuroSlides</span>
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
        <div className="h-7 bg-[#b7472a] dark:bg-[#8b3520] flex items-center px-2 gap-0.5 border-b border-[#8b3520]">
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10" onClick={handleSave}>
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10">
            <Undo className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10">
            <Redo className="w-3 h-3" />
          </Button>
          <div className="flex-1" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-5 text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1"
            onClick={() => startPresentation(true)}
          >
            <Play className="w-3 h-3" />
            From Beginning
          </Button>
        </div>

        {/* Menu Bar */}
        <div className="h-7 bg-white dark:bg-[#2d2d2d] flex items-center px-1 border-b border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">File</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem onClick={() => { setSlides([{ id: "1", objects: "[]", layout: "title" }]); setCurrentSlideIndex(0); setTitle("Presentation1"); }}>
                <FilePlus className="w-4 h-4 mr-3" /> New <span className="ml-auto text-xs text-muted-foreground">Ctrl+N</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => document.getElementById("file-open")?.click()}>
                <FileInput className="w-4 h-4 mr-3" /> Open <span className="ml-auto text-xs text-muted-foreground">Ctrl+O</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSave}>
                <Save className="w-4 h-4 mr-3" /> Save <span className="ml-auto text-xs text-muted-foreground">Ctrl+S</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><FileDown className="w-4 h-4 mr-3" /> Export As</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={handleExportPDF}>PDF (.pdf)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPPTX}>HTML (.html)</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-3" /> Print <span className="ml-auto text-xs text-muted-foreground">Ctrl+P</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">Edit</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem><Undo className="w-4 h-4 mr-3" /> Undo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span></DropdownMenuItem>
              <DropdownMenuItem><Redo className="w-4 h-4 mr-3" /> Redo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Scissors className="w-4 h-4 mr-3" /> Cut <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span></DropdownMenuItem>
              <DropdownMenuItem><Copy className="w-4 h-4 mr-3" /> Copy <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span></DropdownMenuItem>
              <DropdownMenuItem><ClipboardPaste className="w-4 h-4 mr-3" /> Paste <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={duplicateSelected}><Copy className="w-4 h-4 mr-3" /> Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={deleteSelected} className="text-red-600"><Trash2 className="w-4 h-4 mr-3" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">View</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <ZoomIn className="w-4 h-4 mr-3" /> Zoom In
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <ZoomOut className="w-4 h-4 mr-3" /> Zoom Out
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setZoom(100)}>
                <Eye className="w-4 h-4 mr-3" /> Fit to Window
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowNotes(!showNotes)}>
                <PanelBottom className="w-4 h-4 mr-3" /> {showNotes ? "Hide Notes" : "Show Notes"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowGridlines(!showGridlines)}>
                <Grid3X3 className="w-4 h-4 mr-3" /> {showGridlines ? "Hide Gridlines" : "Show Gridlines"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><LayoutGrid className="w-4 h-4 mr-3" /> New Slide</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {LAYOUTS.map((layout) => (
                    <DropdownMenuItem key={layout.id} onClick={() => addSlide(layout.id)}>{layout.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => addTextBox()}><Type className="w-4 h-4 mr-3" /> Text Box</DropdownMenuItem>
              <DropdownMenuItem onClick={addImage}><ImageIcon className="w-4 h-4 mr-3" /> Picture</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><Square className="w-4 h-4 mr-3" /> Shapes</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {SHAPES.map(({ name, icon: Icon }) => (
                    <DropdownMenuItem key={name} onClick={() => addShape(name)}>
                      <Icon className="w-4 h-4 mr-3" /> {name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">Design</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger><Palette className="w-4 h-4 mr-3" /> Themes</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {THEMES.map((t) => (
                    <DropdownMenuItem key={t.name} onClick={() => setSelectedTheme(t)}>
                      <div className="w-4 h-4 rounded-sm mr-3 border" style={{ backgroundColor: t.bg }} />
                      {t.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">Slide Show</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => startPresentation(true)}>
                <Play className="w-4 h-4 mr-3" /> From Beginning <span className="ml-auto text-xs text-muted-foreground">F5</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => startPresentation(false)}>
                <Play className="w-4 h-4 mr-3" /> From Current Slide <span className="ml-auto text-xs text-muted-foreground">Shift+F5</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#fbe9e7] dark:hover:bg-gray-700">Help</Button>
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
              <TabsTrigger value="home" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#b7472a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Home className="w-3 h-3 mr-1" /> Home
              </TabsTrigger>
              <TabsTrigger value="insert" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#b7472a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <LayoutGrid className="w-3 h-3 mr-1" /> Insert
              </TabsTrigger>
              <TabsTrigger value="design" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#b7472a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Palette className="w-3 h-3 mr-1" /> Design
              </TabsTrigger>
              <TabsTrigger value="transitions" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#b7472a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Layers className="w-3 h-3 mr-1" /> Transitions
              </TabsTrigger>
              <TabsTrigger value="slideshow" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#b7472a] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Presentation className="w-3 h-3 mr-1" /> Slide Show
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Ribbon Content */}
          <div className="h-24 bg-[#f3f3f3] dark:bg-[#2d2d2d] px-2 py-1 flex items-start gap-4">
            {/* Clipboard Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700">
                  <ClipboardPaste className="w-5 h-5 text-[#b7472a]" />
                  <span className="text-[9px]">Paste</span>
                </Button>
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#fbe9e7] dark:hover:bg-gray-700">
                    <Scissors className="w-3 h-3 mr-1" /> Cut
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#fbe9e7] dark:hover:bg-gray-700">
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Clipboard</span>
            </div>

            {/* Slides Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-14 px-3 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700">
                      <Plus className="w-5 h-5 text-[#b7472a]" />
                      <span className="text-[9px]">New Slide</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {LAYOUTS.map((layout) => (
                      <DropdownMenuItem key={layout.id} onClick={() => addSlide(layout.id)}>{layout.name}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#fbe9e7] dark:hover:bg-gray-700" onClick={duplicateSlide}>
                    <Copy className="w-3 h-3 mr-1" /> Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#fbe9e7] dark:hover:bg-gray-700 text-red-600" onClick={deleteSlide}>
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Slides</span>
            </div>

            {/* Insert Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5">
                <Button variant="ghost" size="sm" className="h-14 px-2 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700" onClick={() => addTextBox()}>
                  <Type className="w-4 h-4" />
                  <span className="text-[9px]">Text</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-14 px-2 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700">
                      <Square className="w-4 h-4" />
                      <span className="text-[9px]">Shapes</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SHAPES.map(({ name, icon: Icon }) => (
                      <DropdownMenuItem key={name} onClick={() => addShape(name)}>
                        <Icon className="w-4 h-4 mr-2" /> {name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" className="h-14 px-2 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700" onClick={addImage}>
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[9px]">Picture</span>
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Insert</span>
            </div>

            {/* Theme Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-1 h-14 items-center">
                {THEMES.slice(0, 6).map((t) => (
                  <button
                    key={t.name}
                    className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                      selectedTheme.name === t.name ? "border-[#b7472a] ring-2 ring-[#b7472a]/30" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: t.bg }}
                    onClick={() => setSelectedTheme(t)}
                    title={t.name}
                  />
                ))}
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Themes</span>
            </div>

            {/* Start Slideshow */}
            <div className="flex flex-col items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-14 px-4 flex-col gap-0.5 hover:bg-[#fbe9e7] dark:hover:bg-gray-700"
                onClick={() => startPresentation(true)}
              >
                <Play className="w-6 h-6 text-[#b7472a]" />
                <span className="text-[9px]">From Start</span>
              </Button>
              <span className="text-[9px] text-muted-foreground mt-1">Start Show</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Slide panel */}
          <aside className="w-52 border-r border-gray-200 dark:border-gray-700 bg-[#f3f3f3] dark:bg-[#2d2d2d] flex flex-col">
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-medium">Slides</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => addSlide()}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`relative group cursor-pointer transition-all ${
                    index === currentSlideIndex
                      ? "ring-2 ring-[#b7472a]"
                      : "hover:ring-2 hover:ring-gray-400"
                  }`}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground w-4 text-right">
                    {index + 1}
                  </div>
                  <div
                    className="aspect-video rounded border border-gray-300 dark:border-gray-600 ml-4 overflow-hidden flex items-center justify-center text-xs"
                    style={{ backgroundColor: selectedTheme.bg }}
                  >
                    <span style={{ color: selectedTheme.text }} className="text-[10px]">Slide {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Canvas area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-4 bg-[#e0e0e0] dark:bg-[#1a1a1a] overflow-auto">
              <div 
                className="shadow-2xl relative"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center center"
                }}
              >
                {showGridlines && (
                  <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: "linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }} />
                )}
                <canvas ref={canvasRef} />
              </div>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div className="h-32 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d2d] p-2">
                <div className="text-xs font-medium mb-1 text-muted-foreground">Notes</div>
                <textarea
                  value={slideNotes}
                  onChange={(e) => setSlideNotes(e.target.value)}
                  placeholder="Click to add notes..."
                  className="w-full h-20 text-sm resize-none border border-gray-200 dark:border-gray-700 rounded p-2 focus:outline-none focus:ring-1 focus:ring-[#b7472a]"
                />
              </div>
            )}
          </div>
        </main>

        {/* Status Bar */}
        <footer className="h-6 bg-[#b7472a] dark:bg-[#8b3520] flex items-center justify-between px-3 text-white text-xs">
          <div className="flex items-center gap-4">
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
            <span>{selectedTheme.name} Theme</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-4 w-4 text-white/70 hover:text-white" onClick={() => setShowNotes(!showNotes)}>
              <PanelBottom className="w-3 h-3" />
            </Button>
            <div className="w-px h-4 bg-white/30" />
            <div className="flex items-center gap-1 ml-2">
              <Button variant="ghost" size="icon" className="h-4 w-4 text-white/70 hover:text-white" onClick={() => setZoom(Math.max(25, zoom - 10))}>
                <ZoomOut className="w-3 h-3" />
              </Button>
              <input 
                type="range" 
                min="25" 
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

      <input type="file" id="file-open" accept=".json" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const data = JSON.parse(event.target?.result as string);
              if (data.slides) {
                setSlides(data.slides);
                setTitle(data.title || "Presentation1");
                setSelectedTheme(data.theme || THEMES[0]);
                toast.success("Presentation loaded!");
              }
            } catch {
              toast.error("Invalid file format");
            }
          };
          reader.readAsText(file);
        }
      }} />
    </>
  );
}
