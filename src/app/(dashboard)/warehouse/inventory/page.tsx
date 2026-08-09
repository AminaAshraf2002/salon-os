import { requireScopedSession } from "@/lib/tenant";
import { reservedByProduct, availableOf, stockState } from "@/lib/stock";
import { ExportButton } from "@/components/console-ui";
import { InventoryTable, type InventoryRow } from "./inventory-table";

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { session, db } = await requireScopedSession("WAREHOUSE_MANAGER");
  const { filter } = await searchParams;

  const products = await db.product.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });
  const reserved = await reservedByProduct(session.orgId);

  let rows: InventoryRow[] = products.map((p) => {
    const res = reserved.get(p.id) ?? 0;
    const available = availableOf(p.stock, res);
    return {
      id: p.id,
      sku: p.sku,
      name: p.name,
      stock: p.stock,
      reserved: res,
      available,
      minStock: p.minStock,
      state: stockState(available, p.minStock),
      active: p.active,
    };
  });

  const totalCount = products.length;
  const lowCount = rows.filter((r) => r.state === "low").length;
  const outCount = rows.filter((r) => r.state === "out").length;

  if (filter === "low") rows = rows.filter((r) => r.state === "low");
  else if (filter === "out") rows = rows.filter((r) => r.state === "out");

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Inventory</h1>
            <p className="text-muted text-sm mt-2 leading-relaxed max-w-2xl">
              Reserved = committed to open orders. Available = stock − reserved, which is what branches
              see. Minimum stock is editable inline.
            </p>
          </div>
          <ExportButton href="/api/exports/inventory" label="Stock take CSV" />
        </div>
        {/* Summary stat chips */}
        <div className="flex gap-3 mt-4 flex-wrap">
          <div className="bg-[#eaf5f4] border border-[#32988b]/20 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-scale-in">
            <span className="text-[#32988b] shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>
            </span>
            <span className="text-[11px] text-[#32988b] font-bold uppercase tracking-wider">Products</span>
            <span className="text-sm font-bold text-[#32988b] tabular-nums ml-1">{totalCount}</span>
          </div>
          {lowCount > 0 && (
            <div className="bg-[#f4ebf7] border border-[#9d5eb6]/20 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-scale-in">
              <span className="text-[#9d5eb6] shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
              </span>
              <span className="text-[11px] text-[#9d5eb6] font-bold uppercase tracking-wider">{lowCount} low</span>
            </div>
          )}
          {outCount > 0 && (
            <div className="bg-[#faebe8] border border-[#d65f49]/20 rounded-xl px-4 py-2.5 flex items-center gap-2 animate-scale-in">
              <span className="text-[#d65f49] shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </span>
              <span className="text-[11px] text-[#d65f49] font-bold uppercase tracking-wider">{outCount} out</span>
            </div>
          )}
        </div>
      </div>
      <InventoryTable rows={rows} activeFilter={filter ?? "all"} />
    </div>
  );
}
