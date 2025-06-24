export function Tabs({ defaultValue, className, children }) {
  return <div className={className}>{children}</div>;
}
export function TabsList({ children, className }) {
  return <div className={className}>{children}</div>;
}
export function TabsTrigger({ value, children }) {
  return <button className="p-2">{children}</button>;
}
export function TabsContent({ value, children }) {
  return <div>{children}</div>;
}
