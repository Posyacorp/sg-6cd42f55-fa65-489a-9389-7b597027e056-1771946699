import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { exportToCSV, exportChartToPDF, formatChartDataForExport } from "@/lib/export";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComparisonChartProps {
  title: string;
  description?: string;
  data: any[];
  metrics: Array<{ key: string; label: string; color: string }>;
  periodOptions?: Array<{ value: string; label: string }>;
  valuePrefix?: string;
}

export function ComparisonChart({ 
  title, 
  description,
  data, 
  metrics,
  periodOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 90 Days" }
  ],
  valuePrefix = ""
}: ComparisonChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [visibleMetrics, setVisibleMetrics] = useState<Set<string>>(
    new Set(metrics.map(m => m.key))
  );

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

  const toggleMetric = (metricKey: string) => {
    const newSet = new Set(visibleMetrics);
    if (newSet.has(metricKey)) {
      newSet.delete(metricKey);
    } else {
      newSet.add(metricKey);
    }
    setVisibleMetrics(newSet);
  };

  // Filter data based on selected period
  const filteredData = data.slice(-parseInt(selectedPeriod));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}:</span> {valuePrefix}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
        <div className="flex flex-wrap gap-2 mt-4">
          {metrics.map(metric => (
            <Button
              key={metric.key}
              variant={visibleMetrics.has(metric.key) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleMetric(metric.key)}
              style={visibleMetrics.has(metric.key) ? { backgroundColor: metric.color } : {}}
            >
              {metric.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div id={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {metrics.map(metric => (
                visibleMetrics.has(metric.key) && (
                  <Line
                    key={metric.key}
                    type="monotone"
                    dataKey={metric.key}
                    stroke={metric.color}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}