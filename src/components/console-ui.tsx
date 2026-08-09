import type { ReactNode } from "react";

/** Consistent page header for the warehouse & admin consoles. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-muted text-sm mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}

/**
 * CSV download link. A plain anchor to /api/exports/… — the route sets
 * Content-Disposition, so the browser saves the file without a client bundle.
 * Hidden when printing; the printed page is the report itself.
 */
export function ExportButton({
  href,
  label = "Export CSV",
  tone = "quiet",
}: {
  href: string;
  label?: string;
  tone?: "quiet" | "primary";
}) {
  return (
    <a
      href={href}
      download
      className={`no-print inline-flex items-center gap-2 h-9 px-3.5 rounded-lg text-xs font-semibold border transition-colors ${
        tone === "primary"
          ? "bg-velvet text-on-velvet border-velvet hover:bg-velvet-dark"
          : "border-line text-muted hover:text-ink hover:border-velvet/40"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 19h16" />
      </svg>
      {label}
    </a>
  );
}

export type Stat = { label: string; value: number | string; tone?: "default" | "in" | "low" | "out" | "accent" };

const TONE: Record<NonNullable<Stat["tone"]>, string> = {
  default: "text-ink",
  in: "text-in",
  low: "text-low",
  out: "text-out",
  accent: "text-velvet",
};

const pastelColors = [
  { bg: '#eaf5f4', text: '#32988b', icon: '#32988b' }, // Pastel Teal
  { bg: '#ebf3fb', text: '#4889c9', icon: '#4889c9' }, // Pastel Blue
  { bg: '#f4ebf7', text: '#9d5eb6', icon: '#9d5eb6' }, // Pastel Purple
  { bg: '#faebe8', text: '#d65f49', icon: '#d65f49' }, // Pastel Orange/Red
];

const defaultIcons = [
  <svg key="i1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg>,
  <svg key="i2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
  <svg key="i3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>,
  <svg key="i4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
];

/** A compact row of KPI cards — the "at a glance" bar. */
export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <div
      className="grid gap-4 mb-8"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(240px, 1fr))` }}
    >
      {stats.map((s, i) => {
        const color = pastelColors[i % pastelColors.length];
        const Icon = defaultIcons[i % defaultIcons.length];
        
        return (
          <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
            <div>
              <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">{s.label}</p>
              <div className="flex items-end gap-2 mt-2">
                <h3 className={`text-xl font-inter tabular-nums ${s.tone && s.tone !== "default" ? TONE[s.tone] : "text-gray-900"}`}>{s.value}</h3>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ml-4" style={{ backgroundColor: color.bg, color: color.icon }}>
              {Icon}
            </div>
          </div>
        );
      })}
    </div>
  );
}
