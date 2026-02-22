import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
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

interface PieChartProps {
  title: string;
  data: any[];
  colors?: string[];
  height?: number;
  innerRadius?: number;
}

export function PieChart({ title, data, colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"], height = 300, innerRadius = 0 }: PieChartProps) {
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
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                innerRadius={innerRadius}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}