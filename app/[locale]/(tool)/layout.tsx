export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="pt-24 pb-12 min-h-screen bg-slate-50">{children}</div>;
}
