"use client";

type Props = {
  value: number;
  description: React.ReactNode;
};

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { useMemo } from "react";

export const description = "A radial chart with text";

const chartConfig = {
  value: {
    label: "Total Won",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export default function CircleProgress({ description, value = 0 }: Props) {
  const dataChart = useMemo(() => {
    return [{ name: "value", visitors: value, fill: "#3b82f6" }];
  }, [value]);

  return (
    <div className="w-fit flex h-[180px] justify-start items-center">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[180px] w-[200px]"
      >
        <RadialBarChart
          data={dataChart}
          startAngle={0}
          endAngle={100}
          innerRadius={80}
          outerRadius={110}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[86, 74]}
          />
          <RadialBar dataKey="visitors" background cornerRadius={10} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-4xl font-bold"
                      >
                        {((value / 46) * 100 || 0).toFixed(0)}%
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total Won
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
      <div>
        <b>Closing Rate</b>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
