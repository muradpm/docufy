"use client";

// Override console.error to suppress the warning about missing defaultProps in Recharts
// This is a temporary workaround for https://github.com/recharts/recharts/issues/3615
const originalConsoleError = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  originalConsoleError(...args);
};

import React, { useMemo } from "react";
import { BarChart } from "@tremor/react";

interface DocumentData {
  title: string;
  wordCount: number;
}

interface PerformanceData {
  name: string;
  documents: DocumentData[];
}

type ChartDataItem = {
  date: string;
  [key: string]: number | string;
};

interface UserPerformanceProps {
  performanceData: PerformanceData[];
}

export const revalidate = 60;

export default function UserPerformance({
  performanceData,
}: UserPerformanceProps) {
  const chartData: ChartDataItem[] = performanceData.map((monthData) => {
    const dataForChart: ChartDataItem = { date: monthData.name };

    monthData.documents.forEach((doc) => {
      dataForChart[doc.title] = doc.wordCount;
    });
    return dataForChart;
  });

  // Extract categories (document titles) from the data
  const categories = useMemo(() => {
    const allDocuments = chartData.flatMap((data) =>
      Object.keys(data).filter((key) => key !== "date")
    );
    return Array.from(new Set(allDocuments));
  }, [chartData]);

  return (
    <>
      <BarChart
        className="mt-4 h-72"
        data={chartData}
        index="date"
        categories={categories}
        colors={[
          "blue",
          "violet",
          "fuchsia",
          "yellow",
          "sky",
          "cyan",
          "emerald",
          "amber",
          "lime",
        ]}
        stack={true}
        yAxisWidth={30}
        showGridLines={false}
        allowDecimals={false}
        enableLegendSlider={true}
        noDataText="Create your first document to see the data."
      />
    </>
  );
}
