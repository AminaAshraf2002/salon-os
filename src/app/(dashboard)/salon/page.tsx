import { requireScopedSession } from "@/lib/tenant";
import React from "react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";

export default async function SalonDashboardPage() {
  const { session, db } = await requireScopedSession(["PURCHASE_MANAGER", "SALON_STAFF"]);
  const branchId = session.locationId;

  if (!branchId) {
    return <div className="text-muted">Your account is not assigned to a branch.</div>;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todaysSales, lowStockCount, inventoryCount, pendingOrders] = await Promise.all([
    db.sale.aggregate({
      where: { branchId, createdAt: { gte: today }, status: { not: "VOID" } },
      _count: true,
      _sum: { totalCents: true }
    }),
    db.branchStock.count({
      where: { branchId, onHand: { gt: 0, lte: 5 } }
    }),
    db.branchStock.count({
      where: { branchId, onHand: { gt: 0 } }
    }),
    db.order.count({
      where: { branchId, status: { in: ["PENDING", "PROCESSING", "PARTIALLY_FULFILLED"] } }
    })
  ]);

  const salesCount = todaysSales._count || 0;
  const salesValue = todaysSales._sum.totalCents || 0;

  return (
    <div className="space-y-8 font-sans">
      {/* KPI Cards styled like Velvet Ops / Warehouse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Pastel Teal */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Today's Sales</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{formatMoney(salesValue)}</h3>
              <span className="text-xs font-semibold text-[#32988b] mb-1">{salesCount} bills</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#eaf5f4] flex items-center justify-center text-[#32988b]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" /><path d="M9 8h6M9 12h6" /></svg>
          </div>
        </div>

        {/* Card 2: Pastel Blue */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Low Stock</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{lowStockCount || 0}</h3>
              <span className="text-xs font-semibold text-[#4889c9] mb-1">Items</span>
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
              <h3 className="text-3xl font-serif text-gray-900">{inventoryCount || 0}</h3>
              <span className="text-xs font-semibold text-[#9d5eb6] mb-1">On Shelf</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#f4ebf7] flex items-center justify-center text-[#9d5eb6]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-5 9 5v10l-9 5-9-5z" /><path d="M3 9l9 5 9-5M12 14v10" /></svg>
          </div>
        </div>

        {/* Card 4: Pastel Orange/Red */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-start justify-between shadow-sm">
          <div>
            <p className="text-[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider">Incoming Orders</p>
            <div className="flex items-end gap-2 mt-2">
              <h3 className="text-3xl font-serif text-gray-900">{pendingOrders || 0}</h3>
              <span className="text-xs font-semibold text-[#d65f49] mb-1">Pending</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#faebe8] flex items-center justify-center text-[#d65f49]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 5h18M3 12h18M3 19h12" /></svg>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-transparent">
        <div className="flex items-center pb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-900"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          <h3 className="text-xl font-serif text-gray-900">Quick Actions</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/salon/sell" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.4 12.2a1.5 1.5 0 0 0 1.5 1.2h8.2a1.5 1.5 0 0 0 1.5-1.2L21.5 7H6" /></svg>
            </div>
            <div>
              <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">New Sale</div>
              <div className="text-xs text-gray-500 leading-relaxed">Open the terminal to bill a customer.</div>
            </div>
          </Link>

          <Link href="/salon/bills" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" /><path d="M9 8h6M9 12h6" /></svg>
            </div>
            <div>
              <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">View Bills</div>
              <div className="text-xs text-gray-500 leading-relaxed">Review past sales and print receipts.</div>
            </div>
          </Link>

          {session.role === "PURCHASE_MANAGER" ? (
            <Link href="/purchase-manager/catalogue" className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-700 group-hover:bg-black group-hover:text-white transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" /><path d="M3 9l1.5-5h15L21 9M9 20v-5h6v5" /></svg>
              </div>
              <div>
                <div className="font-bold text-[14px] text-gray-900 mb-1 group-hover:text-black">Shop Supplies</div>
                <div className="text-xs text-gray-500 leading-relaxed">Order more stock from the warehouse.</div>
              </div>
            </Link>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 flex items-start gap-4 opacity-70">
              <div className="w-12 h-12 rounded-lg bg-[#f6f5f3] flex items-center justify-center text-gray-400">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
              <div>
                <div className="font-bold text-[14px] text-gray-500 mb-1">Stock Order</div>
                <div className="text-xs text-gray-400 leading-relaxed">Ask manager to order supplies.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
