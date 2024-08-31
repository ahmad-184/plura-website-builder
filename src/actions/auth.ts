"use server";

import { redirect } from "next/navigation";
import { getPermissionWithSubaccountId, getUserById } from "./user";
import { cache } from "react";
import { validateRequest } from "@/lib/auth";
import { deleteSession } from "@/lib/session";

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return undefined;
  const user = await getUserById(session.user.id);
  return user;
});

export const assertAuthenticated = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById(session.user.id);
  if (!user) return redirect("/sign-in");
  return user;
});

export const protectAgencyRoute = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById(session.user.id);
  if (!user) return redirect("/sign-in");
  if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN") {
    if (user.role === "SUBACCOUNT_USER" || user.role === "SUBACCOUNT_GUEST")
      return redirect("/subaccount");
    return redirect("/");
  }

  return user;
});

export const protectSubaccountRoute = cache(async (subaccoutnId: string) => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById(session.user.id);
  if (!user) return redirect("/sign-in");
  const permission = await getPermissionWithSubaccountId(
    user.email,
    subaccoutnId
  );
  if (!permission) return redirect("/agency");
  if (!permission.access) return redirect("/agency");
  return user;
});

export const protectEditorRoute = cache(async (subaccoutnId: string) => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById(session.user.id);
  if (!user) return redirect("/sign-in");
  const permission = await getPermissionWithSubaccountId(
    user.email,
    subaccoutnId
  );
  if (!permission) return redirect("/");
  if (!permission.access) return redirect("/");
  return user;
});

export const validateUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) return redirect("/sign-in");
  const user = await getUserById(session.user.id);
  if (!user) return redirect("/sign-in");
  return user;
});

export const logoutUser = async () => {
  await validateUser();
  await deleteSession();
  return redirect("/");
};
