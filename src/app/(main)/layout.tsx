import { auth } from "@clerk/nextjs/server";

export default function Layout({ children }: { children: React.ReactNode }) {
  auth().protect();
  return <>{children}</>;
}
