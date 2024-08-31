import { redirect } from "next/navigation";
import SignUp from "./sign-up";
import { getCurrentUser } from "@/actions/auth";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  return <SignUp />;
}
