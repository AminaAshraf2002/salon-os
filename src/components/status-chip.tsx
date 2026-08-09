import { statusLabel } from "@/lib/format";
import React from "react";

const STYLES: Record<string, { bg: string, text: string, icon: React.ReactNode }> = {
  PENDING: { 
    bg: "bg-[#ebf3fb]", 
    text: "text-[#4889c9]", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> 
  },
  PROCESSING: { 
    bg: "bg-[#faebe8]", 
    text: "text-[#d65f49]", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> 
  },
  PARTIALLY_FULFILLED: { 
    bg: "bg-[#f4ebf7]", 
    text: "text-[#9d5eb6]", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg> 
  },
  COMPLETED: { 
    bg: "bg-[#eaf5f4]", 
    text: "text-[#32988b]", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> 
  },
  CANCELLED: { 
    bg: "bg-gray-100", 
    text: "text-gray-500", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> 
  },
  REJECTED: { 
    bg: "bg-gray-100", 
    text: "text-gray-500", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> 
  },
  RETURNED: { 
    bg: "bg-gray-100", 
    text: "text-gray-500", 
    icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> 
  },
};

export function StatusChip({ status }: { status: string }) {
  const style = STYLES[status] ?? STYLES.PENDING;
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.bg} ${style.text}`}
    >
      <span className="shrink-0">{style.icon}</span>
      {statusLabel(status)}
    </span>
  );
}
