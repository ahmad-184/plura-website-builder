"use server";

import { clerkClient } from "@clerk/nextjs/server";

export const updateUserProfileClerk = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    const user_id = formData.get("user_id") as string;
    await clerkClient.users.updateUserProfileImage(user_id, {
      file: file,
    });
    return true;
  } catch (err) {
    console.log(err);
  }
};
