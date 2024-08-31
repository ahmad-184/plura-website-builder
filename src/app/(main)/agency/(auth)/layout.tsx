import { ModeToggle } from "@/components/mode-toggle";
import PluraLogo from "@/components/plura-logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-auto flex justify-center py-3">
      <div className="fixed flex items-center p-4 top-0 left-0 right-0 justify-between">
        <PluraLogo />
        <ModeToggle />
      </div>
      <div
        className="fixed hidden dark:block top-0 z-[-2] h-screen w-screen inset-0
          bg-neutral-950 
       bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#2463eb2e,#020817)]
       "
      />
      <div className="my-auto">{children}</div>
    </div>
  );
}
