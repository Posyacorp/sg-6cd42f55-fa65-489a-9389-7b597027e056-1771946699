import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { exportToCSV, exportChartToPDF, formatChartDataForExport } from "@/lib/export";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DrillDownData {
  name: string;
  value: number;
  drillDown?: Array<{ name: string; value: number }>;
}

interface DrillDownChartProps {
  title: string;
  data: DrillDownData[];
  dataKey: string;
  colors?: string[];
}

export function DrillDownChart({ title, data, dataKey, colors = ["#8b5cf6", "#06b6d4", "#10b981"] }: DrillDownChartProps) {
  const [drillDownData, setDrillDownData] = useState<Array<{ name: string; value: number }> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleExportCSV = () => {
    const formattedData = formatChartDataForExport(drillDownData || data);
    exportToCSV(formattedData, title.toLowerCase().replace(/\s+/g, '_'));
  };

  const handleExportPDF = async () => {
    const chartElement = document.getElementById(`chart-${title.toLowerCase().replace(/\s+/g, '-')}`);
    await exportChartToPDF(
      drillDownData ? `${title} - ${selectedCategory}` : title,
      formatChartDataForExport(drillDownData || data),
      title.toLowerCase().replace(/\s+/g, '_'),
      {
        description: drillDownData ? 'Detailed breakdown view' : 'Click on any bar to see detailed breakdown',
        includeChart: true,
        chartElement,
      }
    );
  };

  const handleBarClick = (data: any, index: number) => {
    const item = data.payload as DrillDownData;
    if (item.drillDown) {
      setDrillDownData(item.drillDown);
      setSelectedCategory(item.name);
    }
  };

  const handleBack = () => {
    setDrillDownData(null);
    setSelectedCategory("");
  };

  const currentData = drillDownData || data;
  const currentTitle = drillDownData ? `${title} - ${selectedCategory}` : title;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {drillDownData && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <CardTitle>{currentTitle}</CardTitle>
              <CardDescription className="mt-1">
                {drillDownData ? "Detailed breakdown" : "Click any bar to see detailed breakdown"}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportCSV}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div id={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Bar 
                dataKey={dataKey} 
                cursor="pointer"
                radius={[8, 8, 0, 0]}
                onClick={handleBarClick}
              >
                {currentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!drillDownData && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Click on any bar to see detailed breakdown
          </p>
        )}
      </CardContent>
    </Card>
  );
}