import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Navigation from "./_components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-full">
        <Navigation />
        {children}
      </div>
    </>
  );
}
