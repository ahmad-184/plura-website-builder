import {
  getUserAuthDetailsAction,
  verifyAndAcceptInvitationAction,
} from "@/actions";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateNewAgecny from "./_components/create-new-agency";

export default async function page({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  auth().protect();

  const [agencyId] = await verifyAndAcceptInvitationAction();

  const [user] = await getUserAuthDetailsAction();

  if (agencyId && user) {
    if (user?.role === "SUBACCOUNT_USER" || user?.role === "SUBACCOUNT_GUEST")
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
  }

  const user_from_clerk = await currentUser();

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
        <CreateNewAgecny
          companyEmail={user_from_clerk?.emailAddresses[0].emailAddress!}
        />
      </div>
    </div>
  );
}
