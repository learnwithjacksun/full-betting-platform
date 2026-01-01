export default function Pattern({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background relative">
      {/* Crosshatch Art - Light Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
          repeating-linear-gradient(22.5deg, transparent, transparent 2px, var(--foreground) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(67.5deg, transparent, transparent 2px, var(--foreground) 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(112.5deg, transparent, transparent 2px, var(--foreground) 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
          repeating-linear-gradient(157.5deg, transparent, transparent 2px, var(--foreground) 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
        `,
        }}
      />
      <div className="relative text-main">{children}</div>
    </div>
  );
}
