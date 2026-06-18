"use client";

import React, { useState, useMemo } from "react";
import { ArrowUpDown, Download, Copy, ChevronLeft, ChevronRight, Search, FileText } from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

interface ResultsTableProps<T> {
  columns: ColumnConfig<T>[];
  data: T[];
  csvFilename?: string;
  searchKey?: keyof T;
  searchPlaceholder?: string;
  pageSize?: number;
}

export function ResultsTable<T extends Record<string, any>>({
  columns,
  data,
  csvFilename = "export.csv",
  searchKey,
  searchPlaceholder = "Search results...",
  pageSize = 10
}: ResultsTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Search Filter
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    
    return data.filter((row) => {
      const value = row[searchKey as string];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // 2. Sort Logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === undefined || bVal === undefined) return 0;

      // Handle numbers vs strings
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      const aString = String(aVal).toLowerCase();
      const bString = String(bVal).toLowerCase();

      if (aString < bString) return sortConfig.direction === "asc" ? -1 : 1;
      if (aString > bString) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 3. Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  // CSV Export using PapaParse
  const handleExportCSV = () => {
    if (sortedData.length === 0) {
      toast.error("No data available to export.");
      return;
    }

    // Format data for export (remove custom rendering/functions)
    const exportable = sortedData.map((row) => {
      const formattedRow: Record<string, any> = {};
      columns.forEach((col) => {
        const val = row[col.key as string];
        // If it is an array (e.g. trend data), format it as comma separated string
        if (Array.isArray(val)) {
          formattedRow[col.label] = val.join(", ");
        } else {
          formattedRow[col.label] = val;
        }
      });
      return formattedRow;
    });

    const csv = Papa.unparse(exportable);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", csvFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV file downloaded successfully!");
  };

  // Copy all visible columns as tab-separated values to clipboard
  const handleCopyAll = () => {
    if (sortedData.length === 0) {
      toast.error("No data available to copy.");
      return;
    }

    const headersText = columns.map(col => col.label).join("\t");
    const rowsText = sortedData.map(row => {
      return columns.map(col => {
        const val = row[col.key as string];
        return Array.isArray(val) ? val.join(",") : val;
      }).join("\t");
    }).join("\n");

    const textToCopy = `${headersText}\n${rowsText}`;
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied all table rows to clipboard!");
  };
 
  // Export to Markdown Report
  const handleExportMarkdown = () => {
    if (sortedData.length === 0) {
      toast.error("No data available to export.");
      return;
    }
 
    const headersText = `| ${columns.map(col => col.label).join(" | ")} |`;
    const alignmentText = `| ${columns.map(() => "---").join(" | ")} |`;
    const rowsText = sortedData.map(row => {
      return `| ${columns.map(col => {
        const val = row[col.key as string];
        return Array.isArray(val) ? val.join(", ") : String(val !== undefined && val !== null ? val : "").replace(/\|/g, "\\|");
      }).join(" | ")} |`;
    }).join("\n");
 
    const mdContent = `# DevFlow SEO Audit Report\n\nGenerated on: ${new Date().toLocaleString()}\n\n${headersText}\n${alignmentText}\n${rowsText}\n`;
    const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", csvFilename.replace(/\.csv$/, ".md"));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Markdown report downloaded successfully!");
  };

  return (
    <div className="space-y-4">
      {/* Table Actions Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        {searchKey && (
          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        )}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyAll}>
            <Copy className="h-3.5 w-3.5" />
            Copy All
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-accent border-accent/30 hover:bg-accent/10" onClick={handleExportCSV}>
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-primary border-primary/30 hover:bg-primary/10" onClick={handleExportMarkdown}>
            <FileText className="h-3.5 w-3.5" />
            Download MD
          </Button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="border border-card-border/60 bg-card rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-foreground">
            <thead className="bg-card-border/20 border-b border-card-border/30 text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.label}
                    className={`px-6 py-4 ${
                      col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                    }`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key as string)}
                        className="inline-flex items-center gap-1 hover:text-foreground cursor-pointer transition-colors"
                      >
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    ) : (
                      col.label
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border/30">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-card-border/10 transition-colors">
                    {columns.map((col) => {
                      const cellVal = row[col.key as string];
                      return (
                        <td
                          key={col.label}
                          className={`px-6 py-3.5 font-medium ${
                            col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                          }`}
                        >
                          {col.render ? col.render(cellVal, row) : String(cellVal)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground">
                    No results match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-card-border/10 pt-4 text-xs text-muted-foreground">
          <span>
            Showing Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong> ({sortedData.length} total rows)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default ResultsTable;
