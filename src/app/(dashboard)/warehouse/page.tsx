import { requireScopedSession } from "@/lib/tenant";
import React from "react";
import Link from "next/link";

export default async function WarehouseDashboardPage() {
  const { session, db } = await requireScopedSession("WAREHOUSE_MANAGER");

  const [queueCount, outstandingOrders, productCount] = await Promise.all([
    db.order.count({ where: { status: { in: ["PENDING", "PROCESSING"] } } }),
    db.order.findMany({
      where: { status: "PARTIALLY_FULFILLED" },
      select: { items: { select: { requestedQty: true, deliveredQty: true } } },
    }),
    db.product.count({ where: { active: true } })
  ]);

  const outstandingCount = outstandingOrders.reduce(
    (sum, o) => sum + o.items.filter((it) => it.deliveredQty < it.requestedQty).length,
    0
  );

  return (
    <div className="space-y-8 font-sans">
      


      {/* KPI Cards styled like Velvet Ops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pastel Teal */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Order Queue</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{queueCount || 0}</h3>
              <span className="text-xs font-semibold text-[#32988b] mb-1">Active</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#eaf5f4] flex items-center justify-center text-[#32988b]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg>
          </div>
        </div>

        {/* Card 2: Pastel Blue */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Pending Supplies</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{outstandingCount || 0}</h3>
              <span className="text-xs font-semibold text-[#4889c9] mb-1">Pending</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#ebf3fb] flex items-center justify-center text-[#4889c9]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>
          </div>
        </div>

        {/* Card 3: Pastel Purple */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Inventory Items</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{productCount || 0}</h3>
              <span className="text-xs font-semibold text-[#9d5eb6] mb-1">Tracked</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#f4ebf7] flex items-center justify-center text-[#9d5eb6]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>
          </div>
        </div>

        {/* Card 4: Pastel Orange/Red */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">System Health</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">99%</h3>
              <span className="text-xs font-semibold text-[#d65f49] mb-1 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Optimal
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#faebe8] flex items-center justify-center text-[#d65f49]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
          </div>
        </div>
      </div>

      {/* Quick Actions (styled as cards instead of tables) */}
      <div className="bg-transparent">
        <div className="flex items-center pb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-900"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          <h3 className="text-xl font-serif text-gray-900">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/warehouse/queue" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg>
            </div>
            <div>
              <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">Process Queue</div>
              <div className="text-xs text-gray-500 leading-relaxed">Fulfill incoming orders from branches.</div>
            </div>
          </Link>

          <Link href="/warehouse/import" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" /></svg>
            </div>
            <div>
              <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">Import Stock</div>
              <div className="text-xs text-gray-500 leading-relaxed">Upload new inventory sheets instantly.</div>
            </div>
          </Link>

          <Link href="/warehouse/inventory" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>
            </div>
            <div>
              <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">Manage Inventory</div>
              <div className="text-xs text-gray-500 leading-relaxed">Review stock levels and critical alerts.</div>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
