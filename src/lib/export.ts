import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) return "";
          const stringValue = String(value);
          if (stringValue.includes(",") || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split("T")[0];
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${timestamp}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function exportChartToPDF(
  chartTitle: string,
  data: any[],
  filename: string,
  options?: {
    description?: string;
    includeChart?: boolean;
    chartElement?: HTMLElement | null;
  }
) {
  const pdf = new jsPDF();
  let yPosition = 20;

  // Add title
  pdf.setFontSize(18);
  pdf.text(chartTitle, 20, yPosition);
  yPosition += 10;

  // Add description if provided
  if (options?.description) {
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    const splitDescription = pdf.splitTextToSize(options.description, 170);
    pdf.text(splitDescription, 20, yPosition);
    yPosition += splitDescription.length * 5 + 10;
    pdf.setTextColor(0);
  }

  // Add timestamp
  pdf.setFontSize(9);
  pdf.setTextColor(150);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, yPosition);
  yPosition += 10;
  pdf.setTextColor(0);

  // Add chart image if available
  if (options?.includeChart && options?.chartElement) {
    try {
      const canvas = await import("html2canvas").then((mod) => mod.default);
      const chartCanvas = await canvas(options.chartElement, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const chartImage = chartCanvas.toDataURL("image/png");
      
      const imgWidth = 170;
      const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width;
      
      // Check if we need a new page
      if (yPosition + imgHeight > 280) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.addImage(chartImage, "PNG", 20, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 15;
    } catch (error) {
      console.warn("Could not add chart image to PDF:", error);
    }
  }

  // Add data table if we have data
  if (data && data.length > 0) {
    const headers = Object.keys(data[0]);
    const tableData = data.map((row) => headers.map((header) => row[header]));

    // Check if we need a new page for the table
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }

    autoTable(pdf, {
      head: [headers],
      body: tableData,
      startY: yPosition,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
      margin: { left: 20, right: 20 },
    });
  }

  const timestamp = new Date().toISOString().split("T")[0];
  pdf.save(`${filename}_${timestamp}.pdf`);
}

export function formatChartDataForExport(data: any[], valueKeys?: string[]) {
  if (!data || data.length === 0) return [];

  return data.map((item) => {
    const formatted: any = {};
    
    Object.keys(item).forEach((key) => {
      // Skip drill-down data and internal properties
      if (key === "drillDown" || key.startsWith("_")) return;
      
      const value = item[key];
      
      // Format numbers with commas
      if (typeof value === "number") {
        formatted[key] = value.toLocaleString();
      } else {
        formatted[key] = value;
      }
    });
    
    return formatted;
  });
}