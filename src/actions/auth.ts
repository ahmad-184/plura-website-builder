"use server";

import { User } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentUserData } from "./user";

export const protectAgencyRoute = async (user?: User) => {
  try {
    if (user) {
      if (user.role !== "AGENCY_OWNER" && user.role !== "AGENCY_ADMIN") {
        if (user.role === "SUBACCOUNT_USER" || user.role === "SUBACCOUNT_GUEST")
          return redirect("/subaccount");
        return redirect("/");
      } else return user;
    } else {
      const get_user = await getCurrentUserData();
      if (!get_user) return redirect("/");
      if (
        get_user.role !== "AGENCY_OWNER" &&
        get_user.role !== "AGENCY_ADMIN"
      ) {
        if (
          get_user.role === "SUBACCOUNT_USER" ||
          get_user.role === "SUBACCOUNT_GUEST"
        )
          return redirect("/subaccount");
        return redirect("/");
      }

      return get_user;
    }
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const protectSubaccountRoute = async () => {
  try {
    const user = await getCurrentUserData();
    if (!user) return redirect("/agency");
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const validateUser = async () => {
  const user = await getCurrentUser();
  if (!user) return redirect("/sign-in");
  return user;
};
