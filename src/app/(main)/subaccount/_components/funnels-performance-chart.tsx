"use client";

import { Label, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Funnel, FunnelPage } from "@prisma/client";
import React, { useMemo } from "react";
import { Separator } from "@/components/ui/Separator";

type Props = {
  data:
    | (Funnel & {
        FunnelPages: FunnelPage[];
        totalFunnelVisits: number;
        fill: string;
      })[]
    | undefined;
};

// const FunnelPerformanceChart = ({ data }: Props) => {
//   return (
//     <div className="h-fit flex transition-all items-start">
//       <DonutChart
//         className="h-40 w-40"
//         data={data}
//         category="totalFunnelVisits"
//         index="name"
//         colors={["blue-400", "primary", "blue-600", "blue-700", "blue-800"]}
//         showAnimation={true}
//         customTooltip={customTooltip}
//         variant="pie"
//       />
//     </div>
//   );
// };

// export default FunnelPerformanceChart;

// const customTooltip = ({
//   payload,
//   active,
// }: {
//   payload: any;
//   active: boolean;
// }) => {
//   if (!active || !payload) return null;

//   const categoryPayload = payload?.[0];
//   if (!categoryPayload) return null;
//   return (
//     <div className="ml-[100px] dark:text-white text-black w-fit dark:bg-muted/60 backdrop-blur-md bg-background/60 !rounded-lg p-2 shadow-2xl">
//       <div className="flex items-center flex-1 space-x-2.5 mb-1">
//         <div
//           className={`w-5 h-5 rounded-full  bg-${categoryPayload?.color} rounded`}
//         />
//         <div className="w-full">
//           <div className="flex items-center justify-between space-x-8">
//             <p className="text-right whitespace-nowrap">
//               {categoryPayload.name}
//             </p>
//             <p className="font-medium text-right whitespace-nowrap ">
//               {categoryPayload.value}
//             </p>
//           </div>
//         </div>
//       </div>
//       {categoryPayload.payload.FunnelPages?.map((page: any) => (
//         <div
//           key={page.id}
//           className="dark:text-white/70 text-black flex justify-between items-center"
//         >
//           <small>{page.name}</small>
//           <small>{page.visits}</small>
//         </div>
//       ))}
//     </div>
//   );
// };

export const description = "A donut chart with text";

export default function FunnelPerformanceChart({ data }: Props) {
  const chartConfig = useMemo(() => {
    let conf: any = {};

    for (let e of data || []) {
      conf = {
        ...conf,
        [e.name]: {
          label: e.name,
          color: e.fill,
        },
      };
    }
    return conf;
  }, [data]);

  const totalVisit = useMemo(() => {
    let total = 0;
    for (let d of data || []) {
      total = total + Number(d.totalFunnelVisits);
    }
    return total;
  }, [data]);

  return (
    <div className="w-fit flex h-[250px] justify-start">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px] h-full"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            accessibilityLayer
            content={
              <ChartTooltipContent
                labelKey="visitors"
                nameKey="name"
                indicator="line"
                formatter={(value, name, item, index, payload) => (
                  <div className="w-full flex flex-col gap-2 min-w-[110px]">
                    <div className="flex gap-2 w-full">
                      <div
                        className={
                          "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] w-1 h-full"
                        }
                        style={
                          {
                            "--color-bg": item.payload.fill,
                            "--color-border": item.payload.fill,
                          } as React.CSSProperties
                        }
                      />
                      <div className="w-full flex flex-col">
                        <p className="dark:text-gray-200 text-xs font-medium text-black">
                          {name}
                        </p>
                        <div className="w-full flex gap-6 justify-between items-center">
                          <small className="text-xs text-muted-foreground">
                            Total visits
                          </small>
                          <small className="text-xs dark:text-gray-200 text-black">
                            {value}
                          </small>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="w-full flex flex-col gap-1 pb-1">
                      {item.payload.FunnelPages?.map((e: FunnelPage) => (
                        <div className="flex gap-6 items-center justify-between">
                          <small className="text-xs text-muted-foreground">
                            {e.name}
                          </small>
                          <small className="text-xs dark:text-gray-200 text-black">
                            {e.visits}
                          </small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              />
            }
          />
          <Pie
            data={data}
            dataKey="totalFunnelVisits"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
          >
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
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalVisit.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Visitors
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
