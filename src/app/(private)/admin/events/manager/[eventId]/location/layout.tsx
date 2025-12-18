// app/(private)/super/events/create/location/layout.tsx
export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen">{children}</div>;
}
