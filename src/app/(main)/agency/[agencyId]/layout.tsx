import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import Unauthorized from "../_components/unauthorized";
import Sidebar from "@/components/sidebar";
import { getAgency } from "@/actions/agency";
import BlurPage from "@/components/blur-page";
import InfoBar from "@/components/info-bar";
import { protectAgencyRoute } from "@/actions/auth";

export const revalidate = 60;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { agencyId: string };
}) {
  auth().protect();

  if (!params.agencyId) return redirect("/agency");

  const agency_exist = await getAgency(params.agencyId);

  if (!agency_exist) return notFound();

  const user = await protectAgencyRoute();

  if (!user) return redirect("/agency");

  if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN")
    return <Unauthorized />;

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar type="agency" id={params.agencyId} />
      <div className="md:ml-[300px]">
        <div className="relative">
          <InfoBar type="agency" id={agency_exist.id} />
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
}
