import { verifyAndAcceptInvitationAction } from "@/actions";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateNewAgency from "./_components/create-new-agency";
import { getCurrentUser, validateUser } from "@/actions/auth";

export const revalidate = 60;

export default async function page({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");

  let agencyId: string | null = null;

  try {
    const res = await verifyAndAcceptInvitationAction();
    if (res) agencyId = res;
    else agencyId = null;
  } catch (err) {
    console.log(err);
  }

  if (agencyId && user) {
    if (
      user?.role === "SUBACCOUNT_ADMIN" ||
      user?.role === "SUBACCOUNT_USER" ||
      user?.role === "SUBACCOUNT_GUEST"
    )
      return redirect("/subaccount");
    if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan)
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      }
      return redirect(`/agency/${agencyId}`);
    }
  } else {
    const user_exist = await validateUser();
    if (!user_exist) return redirect("/sign-in");
    if (user_exist.agencyId) return redirect("/agency");

    return (
      <div className="w-full flex items-center justify-center overflow-auto py-[3rem]">
        <div
          className="fixed hidden dark:block top-0 z-[-2] h-screen w-screen inset-0
          bg-neutral-950 
       bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#2463eb2e,#020817)]
       "
        />
        <div className="w-full max-w-3xl p-4">
          <h1 className="text-4xl text-center mb-5">Create An Agency</h1>
          <CreateNewAgency companyEmail={user_exist.email} />
        </div>
      </div>
    );
  }
}
