import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, Download, Upload, Moon, Sun, Clock,
  Plus, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight,
  Copy, Scissors, ClipboardPaste, Undo, Redo, Search, ZoomIn, ZoomOut,
  ChevronDown, Printer, Filter, SortAsc, SortDesc, Table2, Home,
  LayoutGrid, FileDown, FilePlus, Share2, HelpCircle, Sparkles, BarChart2,
  PaintBucket, Type, Percent, DollarSign, Hash, Calendar, Eye, FileInput,
  ArrowUpDown, Merge, SplitSquareHorizontal, Sigma, FunctionSquare, Replace
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

type CellValue = string | number;
type CellStyle = {
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  backgroundColor?: string;
  textColor?: string;
  format?: "number" | "currency" | "percent" | "date" | "text";
};

interface Cell {
  value: CellValue;
  formula?: string;
  style?: CellStyle;
}

type SheetData = Record<string, Cell>;

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const ROWS = Array.from({ length: 100 }, (_, i) => i + 1);
const VISIBLE_COLS = 15;
const VISIBLE_ROWS = 30;

const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36"];

const COLORS = [
  "#ffffff", "#000000", "#e7e6e6", "#44546a", "#4472c4", "#ed7d31", "#a5a5a5", "#ffc000", "#5b9bd5", "#70ad47",
  "#f2f2f2", "#7f7f7f", "#d0cece", "#d6dce4", "#d9e2f3", "#fbe5d5", "#ededed", "#fff2cc", "#deebf6", "#e2efda",
  "#d8d8d8", "#595959", "#aeabab", "#adb9ca", "#b4c6e7", "#f7cbac", "#dbdbdb", "#ffe599", "#bdd7ee", "#c5e0b3",
  "#bfbfbf", "#3f3f3f", "#757070", "#8496b0", "#8eaadb", "#f4b183", "#c9c9c9", "#ffd966", "#9dc3e6", "#a8d08d",
];

export default function NeuroSheets() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Book1");
  const [data, setData] = useState<SheetData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>("A1");
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const [zoom, setZoom] = useState(100);
  const [fontSize, setFontSize] = useState("11");
  const [scrollX, setScrollX] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [sheets, setSheets] = useState(["Sheet1", "Sheet2", "Sheet3"]);
  const [activeSheet, setActiveSheet] = useState("Sheet1");
  const inputRef = useRef<HTMLInputElement>(null);
  const formulaBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentTool("sheets");
    
    const saved = localStorage.getItem("neuroadapt-sheets-current");
    if (saved) {
      const sheet = JSON.parse(saved);
      setTitle(sheet.title);
      setData(sheet.data);
      setLastSaved(new Date(sheet.updatedAt));
    }

    return () => setCurrentTool(null);
  }, [setCurrentTool]);

  const getCellId = (col: string, row: number) => `${col}${row}`;

  const parseFormula = useCallback((formula: string, currentData: SheetData): number => {
    const cleanFormula = formula.substring(1).toUpperCase();
    
    // SUM function
    const sumMatch = cleanFormula.match(/^SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
    if (sumMatch) {
      const [, startCol, startRow, endCol, endRow] = sumMatch;
      let sum = 0;
      const startColIndex = COLS.indexOf(startCol);
      const endColIndex = COLS.indexOf(endCol);
      for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
          const cellId = getCellId(COLS[c], r);
          const cellValue = currentData[cellId]?.value;
          if (typeof cellValue === "number") sum += cellValue;
          else if (typeof cellValue === "string" && !isNaN(parseFloat(cellValue))) {
            sum += parseFloat(cellValue);
          }
        }
      }
      return sum;
    }

    // AVERAGE function
    const avgMatch = cleanFormula.match(/^AVERAGE\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
    if (avgMatch) {
      const [, startCol, startRow, endCol, endRow] = avgMatch;
      let sum = 0;
      let count = 0;
      const startColIndex = COLS.indexOf(startCol);
      const endColIndex = COLS.indexOf(endCol);
      for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
          const cellId = getCellId(COLS[c], r);
          const cellValue = currentData[cellId]?.value;
          if (typeof cellValue === "number") {
            sum += cellValue;
            count++;
          } else if (typeof cellValue === "string" && !isNaN(parseFloat(cellValue))) {
            sum += parseFloat(cellValue);
            count++;
          }
        }
      }
      return count > 0 ? sum / count : 0;
    }

    // COUNT function
    const countMatch = cleanFormula.match(/^COUNT\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
    if (countMatch) {
      const [, startCol, startRow, endCol, endRow] = countMatch;
      let count = 0;
      const startColIndex = COLS.indexOf(startCol);
      const endColIndex = COLS.indexOf(endCol);
      for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
          const cellId = getCellId(COLS[c], r);
          const cellValue = currentData[cellId]?.value;
          if (cellValue !== undefined && cellValue !== "") count++;
        }
      }
      return count;
    }

    // MAX function
    const maxMatch = cleanFormula.match(/^MAX\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
    if (maxMatch) {
      const [, startCol, startRow, endCol, endRow] = maxMatch;
      let max = -Infinity;
      const startColIndex = COLS.indexOf(startCol);
      const endColIndex = COLS.indexOf(endCol);
      for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
          const cellId = getCellId(COLS[c], r);
          const cellValue = currentData[cellId]?.value;
          const num = typeof cellValue === "number" ? cellValue : parseFloat(cellValue?.toString() || "");
          if (!isNaN(num)) max = Math.max(max, num);
        }
      }
      return max === -Infinity ? 0 : max;
    }

    // MIN function
    const minMatch = cleanFormula.match(/^MIN\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
    if (minMatch) {
      const [, startCol, startRow, endCol, endRow] = minMatch;
      let min = Infinity;
      const startColIndex = COLS.indexOf(startCol);
      const endColIndex = COLS.indexOf(endCol);
      for (let c = startColIndex; c <= endColIndex; c++) {
        for (let r = parseInt(startRow); r <= parseInt(endRow); r++) {
          const cellId = getCellId(COLS[c], r);
          const cellValue = currentData[cellId]?.value;
          const num = typeof cellValue === "number" ? cellValue : parseFloat(cellValue?.toString() || "");
          if (!isNaN(num)) min = Math.min(min, num);
        }
      }
      return min === Infinity ? 0 : min;
    }

    // Simple math: =A1+B1, =A1*2, etc.
    try {
      const evaluated = cleanFormula.replace(/([A-Z]+)(\d+)/g, (_, col, row) => {
        const cellId = getCellId(col, parseInt(row));
        const cellValue = currentData[cellId]?.value;
        if (typeof cellValue === "number") return cellValue.toString();
        if (typeof cellValue === "string" && !isNaN(parseFloat(cellValue))) {
          return parseFloat(cellValue).toString();
        }
        return "0";
      });
      // eslint-disable-next-line no-eval
      return eval(evaluated) || 0;
    } catch {
      return 0;
    }
  }, []);

  const getCellDisplayValue = useCallback((cellId: string): string => {
    const cell = data[cellId];
    if (!cell) return "";
    if (cell.formula) {
      const result = parseFormula(cell.formula, data);
      if (cell.style?.format === "currency") return `$${result.toFixed(2)}`;
      if (cell.style?.format === "percent") return `${(result * 100).toFixed(1)}%`;
      return result.toString();
    }
    if (cell.style?.format === "currency" && typeof cell.value === "number") {
      return `$${cell.value.toFixed(2)}`;
    }
    if (cell.style?.format === "percent" && typeof cell.value === "number") {
      return `${(cell.value * 100).toFixed(1)}%`;
    }
    return cell.value.toString();
  }, [data, parseFormula]);

  const handleCellClick = (cellId: string, e?: React.MouseEvent) => {
    if (e?.shiftKey && selectedCell) {
      setSelectedRange({ start: selectedCell, end: cellId });
    } else {
      setSelectedCell(cellId);
      setSelectedRange(null);
    }
    if (editingCell !== cellId) {
      setEditingCell(null);
    }
  };

  const handleCellDoubleClick = (cellId: string) => {
    setEditingCell(cellId);
    const cell = data[cellId];
    setEditValue(cell?.formula || cell?.value?.toString() || "");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleCellBlur = () => {
    if (editingCell && editValue !== undefined) {
      const isFormula = editValue.startsWith("=");
      const numValue = parseFloat(editValue);
      
      setData((prev) => ({
        ...prev,
        [editingCell]: {
          ...prev[editingCell],
          value: isFormula ? parseFormula(editValue, prev) : (isNaN(numValue) ? editValue : numValue),
          formula: isFormula ? editValue : undefined,
        },
      }));
    }
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCellBlur();
      // Move to next row
      if (selectedCell) {
        const match = selectedCell.match(/([A-Z]+)(\d+)/);
        if (match) {
          const [, col, row] = match;
          const nextRow = Math.min(parseInt(row) + 1, ROWS.length);
          setSelectedCell(`${col}${nextRow}`);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleCellBlur();
      // Move to next column
      if (selectedCell) {
        const match = selectedCell.match(/([A-Z]+)(\d+)/);
        if (match) {
          const [, col, row] = match;
          const colIndex = COLS.indexOf(col);
          if (colIndex < COLS.length - 1) {
            setSelectedCell(`${COLS[colIndex + 1]}${row}`);
          }
        }
      }
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const handleSave = useCallback(() => {
    const sheet = {
      title,
      data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("neuroadapt-sheets-current", JSON.stringify(sheet));
    setLastSaved(new Date());
    toast.success("Spreadsheet saved!");
  }, [title, data]);

  const handleExportCSV = useCallback(() => {
    let csv = "";
    for (const row of ROWS.slice(0, 50)) {
      const rowData = COLS.slice(0, 20).map((col) => {
        const cellId = getCellId(col, row);
        return getCellDisplayValue(cellId);
      });
      csv += rowData.join(",") + "\n";
    }
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("CSV exported!");
  }, [title, getCellDisplayValue]);

  const handleExportXLSX = useCallback(() => {
    // Create basic XLSX-compatible HTML
    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table>`;
    for (const row of ROWS.slice(0, 50)) {
      html += "<tr>";
      for (const col of COLS.slice(0, 20)) {
        const cellId = getCellId(col, row);
        html += `<td>${getCellDisplayValue(cellId)}</td>`;
      }
      html += "</tr>";
    }
    html += "</table></body></html>";
    
    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_")}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success("Excel file exported!");
  }, [title, getCellDisplayValue]);

  const handleImportCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n");
      const newData: SheetData = {};
      
      lines.forEach((line, rowIndex) => {
        if (rowIndex >= ROWS.length) return;
        const cells = line.split(",");
        cells.forEach((value, colIndex) => {
          if (colIndex >= COLS.length) return;
          const cellId = getCellId(COLS[colIndex], ROWS[rowIndex]);
          const numValue = parseFloat(value.trim());
          newData[cellId] = {
            value: isNaN(numValue) ? value.trim() : numValue,
          };
        });
      });
      
      setData(newData);
      toast.success("CSV imported!");
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const toggleCellStyle = (style: keyof CellStyle) => {
    if (!selectedCell) return;
    setData((prev) => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        value: prev[selectedCell]?.value || "",
        style: {
          ...prev[selectedCell]?.style,
          [style]: !prev[selectedCell]?.style?.[style],
        },
      },
    }));
  };

  const setCellAlign = (align: "left" | "center" | "right") => {
    if (!selectedCell) return;
    setData((prev) => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        value: prev[selectedCell]?.value || "",
        style: {
          ...prev[selectedCell]?.style,
          align,
        },
      },
    }));
  };

  const setCellFormat = (format: CellStyle["format"]) => {
    if (!selectedCell) return;
    setData((prev) => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        value: prev[selectedCell]?.value || "",
        style: {
          ...prev[selectedCell]?.style,
          format,
        },
      },
    }));
  };

  const setCellBackgroundColor = (color: string) => {
    if (!selectedCell) return;
    setData((prev) => ({
      ...prev,
      [selectedCell]: {
        ...prev[selectedCell],
        value: prev[selectedCell]?.value || "",
        style: {
          ...prev[selectedCell]?.style,
          backgroundColor: color,
        },
      },
    }));
  };

  const visibleCols = COLS.slice(scrollX, scrollX + VISIBLE_COLS);
  const visibleRows = ROWS.slice(scrollY, scrollY + VISIBLE_ROWS);

  return (
    <>
      <Helmet>
        <title>{title} - NeuroSheets</title>
      </Helmet>
      <BreakReminder />

      <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#1e1e1e] flex flex-col">
        {/* Title Bar - Excel Style */}
        <div className="h-8 bg-[#217346] dark:bg-[#165a32] flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                <span className="text-[#217346] font-bold text-[10px]">X</span>
              </div>
              <span className="text-white text-xs font-medium">{title} - NeuroSheets</span>
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
        <div className="h-7 bg-[#217346] dark:bg-[#165a32] flex items-center px-2 gap-0.5 border-b border-[#165a32]">
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10" onClick={handleSave}>
            <Save className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10">
            <Undo className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:text-white hover:bg-white/10">
            <Redo className="w-3 h-3" />
          </Button>
        </div>

        {/* Menu Bar */}
        <div className="h-7 bg-white dark:bg-[#2d2d2d] flex items-center px-1 border-b border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">File</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem onClick={() => { setData({}); setTitle("Book1"); }}>
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
                  <DropdownMenuItem onClick={handleExportCSV}>CSV (.csv)</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportXLSX}>Excel (.xls)</DropdownMenuItem>
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
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">Edit</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem><Undo className="w-4 h-4 mr-3" /> Undo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Z</span></DropdownMenuItem>
              <DropdownMenuItem><Redo className="w-4 h-4 mr-3" /> Redo <span className="ml-auto text-xs text-muted-foreground">Ctrl+Y</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Scissors className="w-4 h-4 mr-3" /> Cut <span className="ml-auto text-xs text-muted-foreground">Ctrl+X</span></DropdownMenuItem>
              <DropdownMenuItem><Copy className="w-4 h-4 mr-3" /> Copy <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span></DropdownMenuItem>
              <DropdownMenuItem><ClipboardPaste className="w-4 h-4 mr-3" /> Paste <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Search className="w-4 h-4 mr-3" /> Find <span className="ml-auto text-xs text-muted-foreground">Ctrl+F</span></DropdownMenuItem>
              <DropdownMenuItem><Replace className="w-4 h-4 mr-3" /> Replace <span className="ml-auto text-xs text-muted-foreground">Ctrl+H</span></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">View</Button>
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
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">Insert</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem><BarChart2 className="w-4 h-4 mr-3" /> Chart</DropdownMenuItem>
              <DropdownMenuItem><Table2 className="w-4 h-4 mr-3" /> Table</DropdownMenuItem>
              <DropdownMenuItem><FunctionSquare className="w-4 h-4 mr-3" /> Function</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">Data</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem><SortAsc className="w-4 h-4 mr-3" /> Sort A to Z</DropdownMenuItem>
              <DropdownMenuItem><SortDesc className="w-4 h-4 mr-3" /> Sort Z to A</DropdownMenuItem>
              <DropdownMenuItem><Filter className="w-4 h-4 mr-3" /> Filter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-3 text-xs hover:bg-[#e2f0e9] dark:hover:bg-gray-700">Help</Button>
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
              <TabsTrigger value="home" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#217346] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <Home className="w-3 h-3 mr-1" /> Home
              </TabsTrigger>
              <TabsTrigger value="insert" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#217346] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <LayoutGrid className="w-3 h-3 mr-1" /> Insert
              </TabsTrigger>
              <TabsTrigger value="formulas" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#217346] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <FunctionSquare className="w-3 h-3 mr-1" /> Formulas
              </TabsTrigger>
              <TabsTrigger value="data" className="h-8 px-4 text-xs rounded-none border-b-2 border-transparent data-[state=active]:border-[#217346] data-[state=active]:bg-[#f3f3f3] dark:data-[state=active]:bg-[#3d3d3d]">
                <ArrowUpDown className="w-3 h-3 mr-1" /> Data
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Ribbon Content */}
          <div className="h-24 bg-[#f3f3f3] dark:bg-[#2d2d2d] px-2 py-1 flex items-start gap-4">
            {/* Clipboard Group */}
            <div className="flex flex-col items-center border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-12 w-12 flex-col gap-0.5 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <ClipboardPaste className="w-5 h-5 text-[#217346]" />
                  <span className="text-[9px]">Paste</span>
                </Button>
                <div className="flex flex-col gap-0.5">
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                    <Scissors className="w-3 h-3 mr-1" /> Cut
                  </Button>
                  <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1">Clipboard</span>
            </div>

            {/* Font Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-1 mb-1">
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
                <Button variant={selectedCell && data[selectedCell]?.style?.bold ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => toggleCellStyle("bold")}>
                  <Bold className="w-3.5 h-3.5" />
                </Button>
                <Button variant={selectedCell && data[selectedCell]?.style?.italic ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => toggleCellStyle("italic")}>
                  <Italic className="w-3.5 h-3.5" />
                </Button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-0.5" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                      <PaintBucket className="w-3.5 h-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="p-2">
                    <div className="grid grid-cols-10 gap-0.5">
                      {COLORS.map(color => (
                        <button key={color} className="w-4 h-4 rounded-sm border border-gray-300 hover:scale-125 transition-transform" style={{ backgroundColor: color }} onClick={() => setCellBackgroundColor(color)} />
                      ))}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
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

            {/* Alignment Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5 mb-1">
                <Button variant={selectedCell && data[selectedCell]?.style?.align === "left" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setCellAlign("left")}>
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
                <Button variant={selectedCell && data[selectedCell]?.style?.align === "center" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setCellAlign("center")}>
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
                <Button variant={selectedCell && data[selectedCell]?.style?.align === "right" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setCellAlign("right")}>
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Merge className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <SplitSquareHorizontal className="w-3.5 h-3.5" />
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Alignment</span>
            </div>

            {/* Number Format Group */}
            <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 pr-3">
              <div className="flex gap-0.5 mb-1">
                <Button variant={selectedCell && data[selectedCell]?.style?.format === "currency" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setCellFormat("currency")}>
                  <DollarSign className="w-3.5 h-3.5" />
                </Button>
                <Button variant={selectedCell && data[selectedCell]?.style?.format === "percent" ? "secondary" : "ghost"} size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setCellFormat("percent")}>
                  <Percent className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Hash className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="flex gap-0.5">
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Calendar className="w-3.5 h-3.5" />
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Number</span>
            </div>

            {/* Cells Group */}
            <div className="flex flex-col">
              <div className="flex flex-col gap-0.5">
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Plus className="w-3 h-3 mr-1" /> Insert
                </Button>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
                <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] justify-start hover:bg-[#e2f0e9] dark:hover:bg-gray-700">
                  <Table2 className="w-3 h-3 mr-1" /> Format
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Cells</span>
            </div>

            {/* Sum/Functions Group */}
            <div className="flex flex-col ml-2">
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-14 px-3 flex-col gap-0.5 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => {
                  if (selectedCell) {
                    setEditingCell(selectedCell);
                    setEditValue("=SUM()");
                    setTimeout(() => formulaBarRef.current?.focus(), 0);
                  }
                }}>
                  <Sigma className="w-5 h-5 text-[#217346]" />
                  <span className="text-[9px]">AutoSum</span>
                </Button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 text-center">Editing</span>
            </div>
          </div>
        </div>

        {/* Formula Bar */}
        <div className="h-8 bg-white dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex items-center px-2">
          <div className="w-20 h-6 border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs font-medium bg-gray-50 dark:bg-gray-800 mr-2">
            {selectedCell}
          </div>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <span className="text-xs text-muted-foreground mx-2 italic">fx</span>
          <Input
            ref={formulaBarRef}
            value={editingCell ? editValue : (selectedCell && data[selectedCell]?.formula) || (selectedCell && data[selectedCell]?.value?.toString()) || ""}
            onChange={(e) => {
              if (editingCell) setEditValue(e.target.value);
            }}
            onFocus={() => {
              if (selectedCell && !editingCell) {
                setEditingCell(selectedCell);
                const cell = data[selectedCell];
                setEditValue(cell?.formula || cell?.value?.toString() || "");
              }
            }}
            onBlur={handleCellBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 h-6 text-xs border-gray-300 dark:border-gray-600"
            placeholder="Enter formula or value..."
          />
        </div>

        {/* Spreadsheet */}
        <main className="flex-1 overflow-hidden bg-white dark:bg-[#1e1e1e] flex flex-col">
          <div className="flex-1 overflow-auto" style={{ fontSize: `${11 * zoom / 100}px` }}>
            <table className="border-collapse min-w-full">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="w-10 h-6 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e0e0e0] dark:border-[#3d3d3d] text-[10px] font-normal text-gray-600 sticky left-0 z-20" />
                  {visibleCols.map((col) => (
                    <th
                      key={col}
                      className="min-w-[80px] h-6 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e0e0e0] dark:border-[#3d3d3d] text-[10px] font-normal text-gray-600"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={row}>
                    <td className="w-10 h-6 bg-[#f3f3f3] dark:bg-[#2d2d2d] border border-[#e0e0e0] dark:border-[#3d3d3d] text-[10px] font-normal text-gray-600 text-center sticky left-0 z-10">
                      {row}
                    </td>
                    {visibleCols.map((col) => {
                      const cellId = getCellId(col, row);
                      const cell = data[cellId];
                      const isSelected = selectedCell === cellId;
                      const isEditing = editingCell === cellId;
                      
                      return (
                        <td
                          key={cellId}
                          className={`min-w-[80px] h-6 border border-[#e0e0e0] dark:border-[#3d3d3d] text-xs cursor-cell transition-colors relative
                            ${isSelected ? "outline outline-2 outline-[#217346] outline-offset-[-1px] z-10" : ""}
                            ${cell?.style?.bold ? "font-bold" : ""}
                            ${cell?.style?.italic ? "italic" : ""}
                          `}
                          style={{ 
                            textAlign: cell?.style?.align || "left",
                            backgroundColor: cell?.style?.backgroundColor || undefined
                          }}
                          onClick={(e) => handleCellClick(cellId, e)}
                          onDoubleClick={() => handleCellDoubleClick(cellId)}
                        >
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              className="w-full h-full px-1 bg-white dark:bg-[#1e1e1e] border-none outline-none text-xs absolute inset-0"
                              autoFocus
                            />
                          ) : (
                            <div className="px-1 py-0.5 truncate">
                              {getCellDisplayValue(cellId)}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Horizontal Scrollbar */}
          <div className="h-4 bg-[#f3f3f3] dark:bg-[#2d2d2d] border-t border-[#e0e0e0] dark:border-[#3d3d3d] flex items-center px-2">
            <input
              type="range"
              min="0"
              max={COLS.length - VISIBLE_COLS}
              value={scrollX}
              onChange={(e) => setScrollX(parseInt(e.target.value))}
              className="flex-1 h-2 accent-[#217346]"
            />
          </div>
        </main>

        {/* Sheet Tabs */}
        <div className="h-7 bg-[#f3f3f3] dark:bg-[#2d2d2d] border-t border-[#e0e0e0] dark:border-[#3d3d3d] flex items-center px-2">
          <Button variant="ghost" size="icon" className="h-5 w-5 hover:bg-[#e2f0e9] dark:hover:bg-gray-700" onClick={() => setSheets([...sheets, `Sheet${sheets.length + 1}`])}>
            <Plus className="w-3 h-3" />
          </Button>
          <div className="flex items-center gap-0.5 ml-2">
            {sheets.map((sheet) => (
              <button
                key={sheet}
                className={`h-6 px-3 text-xs rounded-t border-t border-l border-r transition-colors ${
                  activeSheet === sheet
                    ? "bg-white dark:bg-[#1e1e1e] border-[#e0e0e0] dark:border-[#3d3d3d]"
                    : "bg-[#e8e8e8] dark:bg-[#3d3d3d] border-transparent hover:bg-[#d8d8d8] dark:hover:bg-[#4d4d4d]"
                }`}
                onClick={() => setActiveSheet(sheet)}
              >
                {sheet}
              </button>
            ))}
          </div>
        </div>

        {/* Status Bar */}
        <footer className="h-6 bg-[#217346] dark:bg-[#165a32] flex items-center justify-between px-3 text-white text-xs">
          <div className="flex items-center gap-4">
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedCell && data[selectedCell]?.formula && (
              <>
                <span>Sum: {parseFormula(data[selectedCell].formula!, data)}</span>
                <div className="w-px h-4 bg-white/30" />
              </>
            )}
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

      <input type="file" id="file-open" accept=".csv" className="hidden" onChange={handleImportCSV} />
    </>
  );
}
