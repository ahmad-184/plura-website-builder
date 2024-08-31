import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import BlurPage from "@/components/blur-page";
import InfoBar from "@/components/info-bar";
import { getSubaccountWithAccessWithIdAndEmail } from "@/actions/subaccount";
import { protectSubaccountRoute } from "@/actions/auth";

export const revalidate = 60;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subaccountId: string };
}) {
  const user = await protectSubaccountRoute(params.subaccountId);

  if (!params.subaccountId) return redirect("/subaccount");

  const subaccount_exist = await getSubaccountWithAccessWithIdAndEmail(
    params.subaccountId,
    user.email
  );

  if (!subaccount_exist?.SubAccount) return redirect("/agency");

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar type="subaccount" id={params.subaccountId} />
      <div className="md:ml-[300px]">
        <div className="relative">
          <InfoBar type="subaccount" id={subaccount_exist.SubAccount.id} />
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
}
