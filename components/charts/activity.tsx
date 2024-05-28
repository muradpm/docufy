"use client";

// Override console.error to suppress the warning about missing defaultProps in Recharts
// This is a temporary workaround for https://github.com/recharts/recharts/issues/3615
const originalConsoleError = console.error;
console.error = (...args: any) => {
  if (/defaultProps/.test(args[0])) return;
  originalConsoleError(...args);
};

import React from "react";
import { AreaChart } from "@tremor/react";

type ChartDataItem = {
  date: string;
  count: number;
};

interface UserActivityProps {
  activityData: ChartDataItem[];
}

export const revalidate = 60;

export default function UserActivity({ activityData }: UserActivityProps) {
  const chartData = activityData.map((item) => ({
    date: item.date,
    Documents: item.count,
  }));

  return (
    <>
      <AreaChart
        className="mt-4 h-72"
        data={chartData}
        index="date"
        categories={["Documents"]}
        colors={["blue"]}
        yAxisWidth={30}
        showGridLines={false}
        allowDecimals={false}
        noDataText="Create your first document to see the data."
      />
    </>
  );
}
