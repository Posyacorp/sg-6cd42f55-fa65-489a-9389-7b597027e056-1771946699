import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportChartToPDF, formatChartDataForExport } from "@/lib/export";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LineChartProps {
  title: string;
  data: any[];
  dataKeys: Array<{ key: string; color: string; name?: string }>;
  height?: number;
  xAxisKey?: string;
}

export function LineChart({ title, data, dataKeys, height = 300, xAxisKey = "name" }: LineChartProps) {
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
        includeChart: true,
        chartElement,
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
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
          <ResponsiveContainer width="100%" height={height}>
            <RechartsLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={xAxisKey} className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              {dataKeys.map((dk) => (
                <Line 
                  key={dk.key} 
                  type="monotone" 
                  dataKey={dk.key} 
                  stroke={dk.color} 
                  strokeWidth={2}
                  name={dk.name || dk.key}
                />
              ))}
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}