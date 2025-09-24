export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-1 text-sm font-semibold rounded ${className}`}>{children}</span>
);
