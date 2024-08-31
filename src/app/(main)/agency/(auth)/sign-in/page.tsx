import { getCurrentUser } from "@/actions/auth";
import SignIn from "./sign-in";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getCurrentUser();
  if (user) return redirect("/");

  return <SignIn />;
}
