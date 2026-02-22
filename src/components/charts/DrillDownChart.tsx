import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{currentTitle}</CardTitle>
        {drillDownData && (
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
            <Legend />
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
        {!drillDownData && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Click on any bar to see detailed breakdown
          </p>
        )}
      </CardContent>
    </Card>
  );
}