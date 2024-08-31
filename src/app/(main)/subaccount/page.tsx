import { verifyAndAcceptInvitationAction } from "@/actions";
import Unauthorized from "../agency/_components/unauthorized";
import { findASubaccountWithUserAccess } from "@/actions/user";
import { redirect } from "next/navigation";
import {
  getCurrentUser,
  protectSubaccountRoute,
  validateUser,
} from "@/actions/auth";

export const revalidate = 60;

export default async function page({
  searchParams,
}: {
  searchParams: { state: string; code: string };
}) {
  const user = await validateUser();

  let agencyId: string | null = null;

  try {
    const res = await verifyAndAcceptInvitationAction();
    if (res) agencyId = res;
  } catch (err) {
    console.log(err);
  }

  if (!agencyId) return <Unauthorized />;

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
