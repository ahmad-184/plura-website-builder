"use client";

import { SignIn } from "@clerk/nextjs";
import { dark, experimental__simple } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();

  return (
    <div>
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : experimental__simple,
        }}
      />
    </div>
  );
}
