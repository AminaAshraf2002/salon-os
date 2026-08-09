import { requireScopedSession } from "@/lib/tenant";
import { reservedByProduct, availableOf, stockState } from "@/lib/stock";
import { fmtDate, orderCode, isVoided } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { StatusChip } from "@/components/status-chip";
import Link from "next/link";
import React from "react";

export default async function OverviewPage() {
  const { session, db } = await requireScopedSession("SUPER_ADMIN");

  const [orders, products, memberships, branches] = await Promise.all([
    db.order.findMany({
      include: {
        branch: { select: { name: true } },
        items: { select: { requestedQty: true, deliveredQty: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.product.findMany(),
    db.membership.count(),
    db.location.findMany({ where: { type: "BRANCH" } }),
  ]);

  const reserved = await reservedByProduct(session.orgId);

  const activeProducts = products.filter((p) => p.active);
  const outstandingLines = orders
    .filter((o) => o.status === "PARTIALLY_FULFILLED")
    .reduce((s, o) => s + o.items.filter((it) => it.deliveredQty < it.requestedQty).length, 0);
  const lowOrOut = activeProducts.filter(
    (p) => stockState(availableOf(p.stock, reserved.get(p.id) ?? 0), p.minStock) !== "in"
  ).length;

  // Orders per branch
  const branchCounts = new Map<string, number>();
  for (const b of branches) branchCounts.set(b.name, 0);
  for (const o of orders) {
    if (isVoided(o.status)) continue;
    branchCounts.set(o.branch.name, (branchCounts.get(o.branch.name) ?? 0) + 1);
  }
  const maxBranch = Math.max(1, ...branchCounts.values());

  // Orders per day, last 14 days
  const days: { label: string; count: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(next.getDate() + 1);
    days.push({
      label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      count: orders.filter((o) => o.createdAt >= d && o.createdAt < next).length,
    });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));
  const points = days
    .map((d, i) => {
      const x = (i / Math.max(days.length - 1, 1)) * 440 + 30;
      const y = 92 - (d.count / maxDay) * 64;
      return `${x},${y}`;
    })
    .join(" ");

  // Category tiles
  const catCounts = new Map<string, number>();
  for (const p of activeProducts) catCounts.set(p.category, (catCounts.get(p.category) ?? 0) + 1);

  const totalValueCents = orders
    .filter((o) => !isVoided(o.status))
    .reduce((s, o) => s + o.totalCents, 0);

  const kpis: [string, number | string][] = [
    ["Total orders", orders.filter((o) => !isVoided(o.status)).length],
    ["Order value", formatMoney(totalValueCents)],
    ["Lines waiting on stock", outstandingLines],
    ["Low or out of stock", lowOrOut],
    ["Team members", memberships],
    ["Products for sale", activeProducts.length],
  ];

  const firstName = session.name.split(" ")[0];

  return (
    <div className="font-sans space-y-8">
      {/* KPI Cards styled like Velvet Ops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(([label, n], i) => {
          const colors = [
            { bg: '#eaf5f4', text: '#32988b', icon: '#32988b' }, // Pastel Teal
            { bg: '#ebf3fb', text: '#4889c9', icon: '#4889c9' }, // Pastel Blue
            { bg: '#f4ebf7', text: '#9d5eb6', icon: '#9d5eb6' }, // Pastel Purple
            { bg: '#faebe8', text: '#d65f49', icon: '#d65f49' }, // Pastel Orange/Red
          ];
          const color = colors[i % colors.length];
          const defaultIcons = [
            <svg key="i1" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg>,
            <svg key="i2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
            <svg key="i3" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>,
            <svg key="i4" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          ];
          const Icon = defaultIcons[i % defaultIcons.length];

          return (
            <div key={label} className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
              <div>
                <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">{label}</p>
                <div className="flex items-end gap-2 mt-2">
                  <h3 className="text-xl font-inter text-gray-900 tabular-nums">{n}</h3>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ml-4" style={{ backgroundColor: color.bg, color: color.icon }}>
                {Icon}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
        {/* Orders over time Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm h-full flex flex-col">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-8">
            Orders — last 14 days
          </h3>
          <div className="flex-1 min-h-[200px]">
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <polyline fill="none" stroke="#d9bd82" strokeWidth="3" points={points} />
              {days.map((d, i) => {
                const x = (i / Math.max(days.length - 1, 1)) * 440 + 30;
                const y = 92 - (d.count / maxDay) * 64;
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r="4" fill="white" stroke="#d9bd82" strokeWidth="2" />
                    {i % 2 === 0 && (
                      <text x={x} y="112" fontSize="9" fill="#a3a3a3" fontWeight="bold" textAnchor="middle" className="font-mono">
                        {d.label.toUpperCase()}
                      </text>
                    )}
                    {d.count > 0 && (
                      <text x={x} y={y - 12} fontSize="10" fill="#1a1a1a" fontWeight="bold" textAnchor="middle">
                        {d.count}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Orders by branch */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-8">
            Orders by branch
          </h3>
          <div className="space-y-4">
            {[...branchCounts.entries()].map(([name, count]) => (
              <div key={name} className="flex items-center gap-4">
                <span className="w-32 text-[11px] font-bold text-gray-500 uppercase tracking-widest truncate">{name}</span>
                <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full"
                    style={{ width: `${(count / maxBranch) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold tabular-nums w-8 text-right text-gray-900">{count}</span>
              </div>
            ))}
            {branchCounts.size === 0 && <p className="text-gray-400 text-xs italic">No orders yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Latest orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-900">Latest orders</h3>
            <Link href="/admin/audit" className="text-[10px] font-bold text-[#8c7849] tracking-widest uppercase border-b border-[#8c7849] hover:text-black hover:border-black transition-colors pb-0.5">
              Full log
            </Link>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 6).map((o) => (
              <div key={o.id} className="flex items-center gap-4 text-[13px] border-b border-gray-100 pb-3 last:border-0">
                <span className="font-mono font-semibold text-gray-900">{orderCode(o.orderNo)}</span>
                <span className="text-gray-500 truncate font-medium">{o.branch.name}</span>
                <span className="font-semibold ml-auto">{formatMoney(o.totalCents)}</span>
                <StatusChip status={o.status} />
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-400 text-xs italic">No orders yet.</p>}
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-gray-900 mb-8">
            Products by category
          </h3>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {[...catCounts.entries()].slice(0, 9).map(([cat, count]) => (
              <div key={cat} className="bg-[#fcfcfc] border border-gray-100 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2 truncate">{cat}</div>
                <div className="text-2xl font-serif text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
