import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportChartToPDF, formatChartDataForExport } from "@/lib/export";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";

interface InteractiveAreaChartProps {
  title: string;
  description?: string;
  data: any[];
  dataKey: string;
  color?: string;
  gradientId?: string;
  valuePrefix?: string;
}

export function InteractiveAreaChart({ 
  title, 
  description,
  data, 
  dataKey,
  color = "#3b82f6",
  valuePrefix = ""
}: InteractiveAreaChartProps) {
  const [showBrush, setShowBrush] = useState(false);

  const handleExportCSV = () => {
    const formattedData = formatChartDataForExport(data);
    exportToCSV(formattedData, title.toLowerCase().replace(/\s+/g, '_'));
  };

  const handleExportPDF = async () => {
    const chartElement = document.getElementById(`chart-${title.toLowerCase().replace(/\s+/g, '-')}`);
    await exportChartToPDF(
      title,
      formatChartDataForExport(data),
      title.toLowerCase().replace(/\s+/g, '_'),
      {
        description,
        includeChart: true,
        chartElement,
      }
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">
            <span className="font-medium">{dataKey}:</span>{" "}
            <span style={{ color }}>{valuePrefix}{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBrush(!showBrush)}
            >
              {showBrush ? "Hide" : "Show"} Range Selector
            </Button>
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
        </div>
      </CardHeader>
      <CardContent>
        <div id={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color}
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#colorValue)`}
              />
              {showBrush && (
                <Brush 
                  dataKey="name" 
                  height={30} 
                  stroke={color}
                  startIndex={0}
                  endIndex={data.length - 1}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}