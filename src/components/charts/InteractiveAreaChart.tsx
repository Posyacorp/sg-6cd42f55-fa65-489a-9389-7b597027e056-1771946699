import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  color = "#8b5cf6",
  gradientId = "colorValue",
  valuePrefix = ""
}: InteractiveAreaChartProps) {
  const [dateRange, setDateRange] = useState<[number, number]>([0, data.length - 1]);
  const [showBrush, setShowBrush] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{label}</p>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowBrush(!showBrush)}
        >
          <Calendar className="w-4 h-4 mr-2" />
          {showBrush ? "Hide" : "Show"} Range Selector
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
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
              fill={`url(#${gradientId})`}
            />
            {showBrush && (
              <Brush 
                dataKey="name" 
                height={30} 
                stroke={color}
                startIndex={dateRange[0]}
                endIndex={dateRange[1]}
                onChange={(range: any) => setDateRange([range.startIndex, range.endIndex])}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}