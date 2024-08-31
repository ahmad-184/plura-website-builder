import { getCurrentUser } from "@/actions/auth";
import VerifyEmail from "./verify-email";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  return <VerifyEmail />;
}
