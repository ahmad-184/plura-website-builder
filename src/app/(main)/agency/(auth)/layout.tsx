export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-7">
      <div className="mx-auto w-fit">{children}</div>
    </div>
  );
}
