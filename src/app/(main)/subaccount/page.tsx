import { verifyAndAcceptInvitationAction } from "@/actions";
import Unauthorized from "../agency/_components/unauthorized";
import {
  findASubaccountWithUserAccess,
  getCurrentUserData,
} from "@/actions/user";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export const revalidate = 60;

export default async function page({
  searchParams,
}: {
  searchParams: { state: string; code: string };
}) {
  auth().protect();

  let agencyId: string | null = null;

  try {
    agencyId = await verifyAndAcceptInvitationAction();
  } catch (err) {
    console.log(err);
  }

  if (!agencyId) return <Unauthorized />;

  const user = await getCurrentUserData();

  if (!user) return <Unauthorized />;

  const permission = await findASubaccountWithUserAccess(user.email);

  if (permission?.SubAccount && searchParams.state) {
    const statePath = searchParams.state.split("___")[0];
    const stateSubaccountId = searchParams.state.split("___")[1];
    if (!stateSubaccountId) return <Unauthorized />;
    return redirect(
      `/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`
    );
  }

  if (permission?.SubAccount) {
    return redirect(`/subaccount/${permission.SubAccount.id}`);
  }

  return <Unauthorized />;
}
