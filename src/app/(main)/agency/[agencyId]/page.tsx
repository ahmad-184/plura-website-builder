import { getAgency } from "@/actions/agency";
import { protectAgencyRoute } from "@/actions/auth";
import { getAgencySubAccounts } from "@/actions/subaccount";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Contact2Icon,
  DollarSignIcon,
  GoalIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import DashboardHistoryTransactionChart from "../_components/dashboard-history-transaction-chart";
import CircleProgress from "@/components/circle-progress";

export const revalidate = 60;

export default async function page({
  params,
}: {
  params: { agencyId: string };
}) {
  await protectAgencyRoute();

  let currency = "USD";
  let sessions;
  let totalClosedSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await getAgency(params.agencyId);

  if (!agencyDetails) return redirect("/agency");

  const subaccounts = await getAgencySubAccounts(params.agencyId);

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
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Active Clients</CardDescription>
              <CardTitle className="text-4xl">
                {subaccounts?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reflects the number of sub accounts you own and manage.
            </CardContent>
            <Contact2Icon className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>Agency Goal</CardTitle>
              <CardDescription>
                <p className="mt-2">
                  Reflects the number of sub accounts you want to own and
                  manage.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Current: {subaccounts?.length}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                  value={
                    ((subaccounts?.length || 0) / agencyDetails.goal) * 100
                  }
                />
              </div>
            </CardFooter>
            <GoalIcon className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="flex flex-col gap-4 xl:flex-row">
          <DashboardHistoryTransactionChart />
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
      </div>
    </div>
  );
}
