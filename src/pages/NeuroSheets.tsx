import { useEffect, useState, useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Save, Download, Upload, Table2, Moon, Sun, Clock,
  Plus, Trash2, Bold, Italic, AlignLeft, AlignCenter, AlignRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useProductivity } from "@/hooks/use-productivity";
import { BreakReminder } from "@/components/BreakReminder";

type CellValue = string | number;
type CellStyle = {
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
};

interface Cell {
  value: CellValue;
  formula?: string;
  style?: CellStyle;
}

type SheetData = Record<string, Cell>;

const COLS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const ROWS = Array.from({ length: 20 }, (_, i) => i + 1);

export default function NeuroSheets() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { setCurrentTool, currentToolTime, formatTime } = useProductivity();
  const [title, setTitle] = useState("Untitled Spreadsheet");
  const [data, setData] = useState<SheetData>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentTool("sheets");
    
    // Load saved spreadsheet
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
    const sumMatch = cleanFormula.match(/^SUM\(([A-J])(\d+):([A-J])(\d+)\)$/);
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
    const avgMatch = cleanFormula.match(/^AVERAGE\(([A-J])(\d+):([A-J])(\d+)\)$/);
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

    // Simple math: =A1+B1, =A1*2, etc.
    try {
      const evaluated = cleanFormula.replace(/([A-J])(\d+)/g, (_, col, row) => {
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
      return parseFormula(cell.formula, data).toString();
    }
    return cell.value.toString();
  }, [data, parseFormula]);

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
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
    for (const row of ROWS) {
      const rowData = COLS.map((col) => {
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

  return (
    <>
      <Helmet>
        <title>{title} | NeuroSheets</title>
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Table2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-none bg-transparent text-lg font-semibold h-auto p-0 focus-visible:ring-0"
                  placeholder="Untitled Spreadsheet"
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
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} />
              </label>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-1 px-4 py-2 border-t border-border/30">
            <Button
              variant={selectedCell && data[selectedCell]?.style?.bold ? "secondary" : "ghost"}
              size="icon"
              onClick={() => toggleCellStyle("bold")}
              disabled={!selectedCell}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedCell && data[selectedCell]?.style?.italic ? "secondary" : "ghost"}
              size="icon"
              onClick={() => toggleCellStyle("italic")}
              disabled={!selectedCell}
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant={selectedCell && data[selectedCell]?.style?.align === "left" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setCellAlign("left")}
              disabled={!selectedCell}
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedCell && data[selectedCell]?.style?.align === "center" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setCellAlign("center")}
              disabled={!selectedCell}
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              variant={selectedCell && data[selectedCell]?.style?.align === "right" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setCellAlign("right")}
              disabled={!selectedCell}
            >
              <AlignRight className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <span className="text-sm text-muted-foreground px-2">
              {selectedCell ? `Selected: ${selectedCell}` : "Click a cell to select"}
            </span>
            {selectedCell && data[selectedCell]?.formula && (
              <span className="text-sm font-mono text-primary px-2">
                {data[selectedCell].formula}
              </span>
            )}
          </div>
        </header>

        {/* Spreadsheet */}
        <main className="flex-1 overflow-auto p-4">
          <div className="bg-background rounded-lg shadow-lg border border-border/50 overflow-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="w-12 h-8 bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground" />
                  {COLS.map((col) => (
                    <th
                      key={col}
                      className="w-24 h-8 bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row}>
                    <td className="w-12 h-8 bg-muted/50 border border-border/50 text-xs font-medium text-muted-foreground text-center">
                      {row}
                    </td>
                    {COLS.map((col) => {
                      const cellId = getCellId(col, row);
                      const cell = data[cellId];
                      const isSelected = selectedCell === cellId;
                      const isEditing = editingCell === cellId;
                      
                      return (
                        <td
                          key={cellId}
                          className={`w-24 h-8 border border-border/50 text-sm cursor-cell transition-colors
                            ${isSelected ? "ring-2 ring-primary ring-inset bg-primary/5" : "hover:bg-muted/30"}
                            ${cell?.style?.bold ? "font-bold" : ""}
                            ${cell?.style?.italic ? "italic" : ""}
                          `}
                          style={{ textAlign: cell?.style?.align || "left" }}
                          onClick={() => handleCellClick(cellId)}
                          onDoubleClick={() => handleCellDoubleClick(cellId)}
                        >
                          {isEditing ? (
                            <input
                              ref={inputRef}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={handleKeyDown}
                              className="w-full h-full px-2 bg-background border-none outline-none"
                            />
                          ) : (
                            <div className="px-2 py-1 truncate">
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

          {/* Formula Help */}
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Formula Help</h3>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span><code className="bg-muted px-1 rounded">=SUM(A1:A10)</code> Sum of range</span>
              <span><code className="bg-muted px-1 rounded">=AVERAGE(A1:A10)</code> Average of range</span>
              <span><code className="bg-muted px-1 rounded">=A1+B1</code> Basic math</span>
              <span><code className="bg-muted px-1 rounded">=A1*2</code> Multiplication</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
