import { verifyAndAcceptInvitationAction } from "@/actions";
import { auth } from "@clerk/nextjs/server";
import { Plan } from "@prisma/client";
import { redirect } from "next/navigation";
import CreateNewAgecny from "./_components/create-new-agency";
import { getCurrentUser, getCurrentUserData } from "@/actions/user";
import AnimateFadeIn from "@/components/animate/animate-fade-in";

export const revalidate = 60;

export default async function page({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  auth().protect();

  let agencyId: string | null = null;

  try {
    agencyId = await verifyAndAcceptInvitationAction();
  } catch (err) {
    console.log(err);
  }

  const user = await getCurrentUserData();

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
  } else {
    const userData = await getCurrentUser();
    if (!userData) return redirect("/sign-in");

    return (
      <AnimateFadeIn>
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
              companyEmail={userData.emailAddresses[0].emailAddress}
            />
          </div>
        </div>
      </AnimateFadeIn>
    );
  }
}
