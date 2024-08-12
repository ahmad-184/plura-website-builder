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
