import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Canvas as FabricCanvas, Rect, IText, FabricImage } from "fabric";
import {
  ArrowLeft, Save, Download, Presentation, Moon, Sun, Clock,
  Plus, Trash2, Play, Type, Square, Image as ImageIcon, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useProductivity } from "@/hooks/use-productivity";
import { BreakReminder } from "@/components/BreakReminder";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Slide {
  id: string;
  objects: string;
  thumbnail?: string;
}

const THEMES = [
  { name: "Light", bg: "#ffffff", text: "#000000" },
  { name: "Dark", bg: "#1a1a2e", text: "#ffffff" },
  { name: "Ocean", bg: "#0f3460", text: "#e0e0e0" },
  { name: "Forest", bg: "#1b4332", text: "#d8f3dc" },
  { name: "Sunset", bg: "#f4a261", text: "#264653" },
];

export default function NeuroSlides() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Untitled Presentation");
  const [slides, setSlides] = useState<Slide[]>([{ id: "1", objects: "[]" }]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [isPresenting, setIsPresenting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const presentationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentTool("slides");
    
    // Load saved presentation
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
      width: 800,
      height: 450,
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

  const addTextBox = () => {
    if (!fabricCanvasRef.current) return;
    const text = new IText("Click to edit", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: selectedTheme.text,
      fontFamily: "Inter, sans-serif",
    });
    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
  };

  const addShape = () => {
    if (!fabricCanvasRef.current) return;
    const rect = new Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: selectedTheme.text + "20",
      stroke: selectedTheme.text,
      strokeWidth: 2,
      rx: 8,
      ry: 8,
    });
    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
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
        img.scaleToWidth(200);
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

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      objects: "[]",
    };
    setSlides((prev) => [...prev, newSlide]);
    setCurrentSlideIndex(slides.length);
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

  const handleSave = useCallback(() => {
    const presentation = {
      title,
      slides,
      theme: selectedTheme,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("neuroadapt-slides-current", JSON.stringify(presentation));
    setLastSaved(new Date());
    toast.success("Presentation saved!");
  }, [title, slides, selectedTheme]);

  const handleExportPDF = useCallback(async () => {
    const pdf = new jsPDF({ orientation: "landscape" });
    
    for (let i = 0; i < slides.length; i++) {
      if (i > 0) pdf.addPage();
      
      // Create temporary canvas for each slide
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 800;
      tempCanvas.height = 450;
      const tempFabric = new FabricCanvas(tempCanvas, {
        width: 800,
        height: 450,
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
      pdf.addImage(dataUrl, "PNG", 10, 10, 277, 156);
      tempFabric.dispose();
    }
    
    pdf.save(`${title.replace(/\s+/g, "_")}.pdf`);
    toast.success("PDF exported!");
  }, [slides, selectedTheme, title]);

  const startPresentation = () => {
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
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      else if (e.key === "ArrowLeft") prevSlide();
      else if (e.key === "Escape") exitPresentation();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPresenting, currentSlideIndex, slides.length, exitPresentation]);

  if (isPresenting) {
    return (
      <div
        ref={presentationRef}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: selectedTheme.bg }}
        onClick={nextSlide}
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full shadow-2xl"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full text-white">
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span>{currentSlideIndex + 1} / {slides.length}</span>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); exitPresentation(); }}>
            Exit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{title} | NeuroSlides</title>
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none bg-transparent text-lg font-semibold h-auto p-0 focus-visible:ring-0"
                  placeholder="Untitled Presentation"
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
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button variant="default" size="sm" onClick={startPresentation}>
                <Play className="w-4 h-4 mr-2" />
                Present
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-t border-border/30">
            <Button variant="ghost" size="sm" onClick={addTextBox}>
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button variant="ghost" size="sm" onClick={addShape}>
              <Square className="w-4 h-4 mr-2" />
              Shape
            </Button>
            <Button variant="ghost" size="sm" onClick={addImage}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button variant="ghost" size="sm" onClick={deleteSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <span className="text-sm text-muted-foreground mr-2">Theme:</span>
            {THEMES.map((t) => (
              <button
                key={t.name}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedTheme.name === t.name ? "border-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: t.bg }}
                onClick={() => setSelectedTheme(t)}
                title={t.name}
              />
            ))}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex">
          {/* Slide panel */}
          <aside className="w-48 border-r border-border/50 bg-muted/20 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Slides</span>
              <Button variant="ghost" size="icon" onClick={addSlide}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`aspect-video rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center text-xs font-medium ${
                    index === currentSlideIndex
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: selectedTheme.bg }}
                  onClick={() => setCurrentSlideIndex(index)}
                >
                  <span style={{ color: selectedTheme.text }}>{index + 1}</span>
                </div>
              ))}
            </div>
            {slides.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-4 text-destructive"
                onClick={deleteSlide}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Slide
              </Button>
            )}
          </aside>

          {/* Canvas area */}
          <div className="flex-1 flex items-center justify-center p-8 bg-muted/10">
            <div className="shadow-2xl rounded-lg overflow-hidden">
              <canvas ref={canvasRef} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
