"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DollarSignIcon } from "lucide-react";
import { usePathname } from "next/navigation";

const chartData = [
  {
    date: "Apr 23",
    amount_total: 29240,
  },
  {
    date: "May 23",
    amount_total: 458240,
  },
  {
    date: "Jun 23",
    amount_total: 100400,
  },
  {
    date: "Jul 23",
    amount_total: 653500,
  },
  {
    date: "Aug 23",
    amount_total: 320340,
  },
  {
    date: "Sep 23",
    amount_total: 120340,
  },
  {
    date: "Oct 23",
    amount_total: 120540,
  },
  {
    date: "Nov 23",
    amount_total: 101140,
  },
  {
    date: "Dec 23",
    amount_total: 453000,
  },
];

const chartConfig = {
  amount_total: {
    label: "Total Amount",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardHistoryTransactionChart() {
  const pathname = usePathname();

  return (
    <Card className="p-4 flex-1">
      <CardHeader>
        <CardTitle>
          {pathname.startsWith("/subaccount")
            ? "Checkout Activity"
            : "Transaction History"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <AreaChart
          className="text-sm w-full stroke-primary"
          data={chartdata}
          index="date"
          categories={["amount_total"]}
          colors={["primary"]}
          yAxisWidth={30}
          showAnimation={true}
          valueFormatter={(number: number) => {
            console.log(number);
            return `$${Intl.NumberFormat("us").format(number).toString()}`;
          }}
        /> */}
        <ChartContainer className="h-64 min-h-64 w-full" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  valueFormatter={(e: number) =>
                    `$${Intl.NumberFormat("us")
                      .format(e as number)
                      .toString()}`
                  }
                  indicator="line"
                  className="w-[180px]"
                />
              }
            />
            <Area
              dataKey="amount_total"
              type="linear"
              fill="hsl(var(--primary))"
              fillOpacity={0.4}
              stroke="hsl(var(--primary))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// export function Component() {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Area Chart</CardTitle>
//         <CardDescription>
//           Showing total visitors for the last 6 months
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ChartContainer config={chartConfig}>
//           <AreaChart
//             accessibilityLayer
//             data={chartData}
//             margin={{
//               left: 12,
//               right: 12,
//             }}
//           >
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="line" />}
//             />
//             <Area
//               dataKey="desktop"
//               type="natural"
//               fill="var(--color-desktop)"
//               fillOpacity={0.4}
//               stroke="var(--color-desktop)"
//             />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter>
//         <div className="flex w-full items-start gap-2 text-sm">
//           <div className="grid gap-2">
//             <div className="flex items-center gap-2 font-medium leading-none">
//               Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
//             </div>
//             <div className="flex items-center gap-2 leading-none text-muted-foreground">
//               January - June 2024
//             </div>
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
