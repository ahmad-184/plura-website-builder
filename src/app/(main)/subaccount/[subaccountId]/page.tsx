import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Contact2Icon, DollarSignIcon, ShoppingCartIcon } from "lucide-react";
import DashboardHistoryTransactionChart from "../../agency/_components/dashboard-history-transaction-chart";
import CircleProgress from "@/components/circle-progress";
import DashboardPipelineValue from "../_components/dashboard-pipeline-value";
import { getPipelinesWithAllDataWithSubaccountId } from "@/actions/pipeline";
import { getSubaccountFunnels } from "@/actions/funnel";
import FunnelPerformanceChart from "../_components/funnels-performance-chart";
import { getRandomColor } from "@/lib/getRandomColor";
import { BadgeDelta } from "@tremor/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fDateTime } from "@/lib/formatTime";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { subaccountId: string };
}) {
  let currency = "USD";
  let sessions;
  let totalClosedSessions = [
    {
      id: 1,
      email: "amirali@gmail.com",
      created: new Date(Date.now() - 60 * 60 * 60 * 24 * 60 * 212),
      amount_total: "2400,00$",
    },
    {
      id: 2,
      email: "koorosh@gmail.com",
      created: new Date(Date.now() - 60 * 60 * 60 * 24 * 60 * 250),
      amount_total: "23400,00$",
    },
    {
      id: 1,
      email: "david@gmail.com",
      created: new Date(Date.now() - 60 * 60 * 60 * 24 * 60),
      amount_total: "1400,00$",
    },
  ];
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const pipelines = await getPipelinesWithAllDataWithSubaccountId(
    params.subaccountId
  );

  const funnels = await getSubaccountFunnels(params.subaccountId);

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  const funnelPerformanceMetrics = funnels?.map((funnel, i) => ({
    ...funnel,
    totalFunnelVisits: funnel.FunnelPages.reduce(
      (total, page) => total + page.visits,
      0
    ),
    fill: colors[i + 1] ? colors[i + 1] : getRandomColor("#3b82f6"),
  }));

  return (
    <div className="w-full h-full">
      <h1 className="text-4xl">Dashboard</h1>
      <div className="flex flex-col gap-4 pb-6 mt-4">
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">$23,042.00</CardTitle>
              <small className="text-xs text-muted-foreground">
                for the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <DollarSignIcon className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Potential Income</CardDescription>
              <CardTitle className="text-4xl">$43,042.00</CardTitle>
              <small className="text-xs text-muted-foreground">
                for the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <DollarSignIcon className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <DashboardPipelineValue pipelines={pipelines || []} />
          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={12}
                description={
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex flex-col">
                      Abandoned
                      <div className="flex gap-2">
                        <ShoppingCartIcon className="text-rose-700" />
                        34
                      </div>
                    </div>
                    <div className="felx flex-col">
                      Won Carts
                      <div className="flex gap-2">
                        <ShoppingCartIcon className="text-emerald-700" />
                        12
                      </div>
                    </div>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4 xl:flex-row">
          <Card className="relative">
            <CardHeader>
              <CardDescription>Funnel Performance</CardDescription>
            </CardHeader>
            <CardContent className=" text-sm text-muted-foreground flex flex-col gap-12 justify-between ">
              <FunnelPerformanceChart data={funnelPerformanceMetrics} />
              <div className="lg:w-[320px]">
                Total page visits across all funnels. Hover over to get more
                details on funnel page performance.
              </div>
            </CardContent>
            <Contact2Icon className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
          <DashboardHistoryTransactionChart />
        </div>
        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1 h-[450px] overflow-scroll relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Transition History
                <BadgeDelta
                  className="rounded-xl bg-transparent"
                  deltaType="moderateIncrease"
                  isIncreasePositive={true}
                  size="xs"
                >
                  +12.3%
                </BadgeDelta>
              </CardTitle>
              <Table>
                <TableHeader className="!sticky !top-0">
                  <TableRow>
                    <TableHead className="w-[300px]">Email</TableHead>
                    <TableHead className="w-[200px]">Status</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="font-medium truncate">
                  {totalClosedSessions
                    ? totalClosedSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>{session.email || "-"}</TableCell>
                          <TableCell>
                            <Badge className="bg-emerald-500 dark:text-black">
                              Paid
                            </Badge>
                          </TableCell>
                          <TableCell>{fDateTime(session.created)}</TableCell>

                          <TableCell className="text-right">
                            <small>{currency}</small>{" "}
                            <span className="text-emerald-500">
                              {session.amount_total}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    : "No Data"}
                </TableBody>
              </Table>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
