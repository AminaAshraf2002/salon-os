"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/actions/cart";
import { formatMoney } from "@/lib/money";
import { optimizedImage } from "@/lib/cloudinary";
import type { StockState } from "@/lib/stock";

type Product = {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  imageUrl?: string | null;
  priceCents: number;
  available: number;
  state: StockState;
};

// Deterministic soft tint per category for the image placeholder.
function tint(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
  return `hsl(${h} 45% 96%)`;
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const isRequirement = product.state === "out";
  const max = isRequirement ? 9999 : Math.max(1, product.available);
  const href = `/purchase-manager/product/${product.id}`;

  function add() {
    startTransition(async () => {
      await addToCart({ productId: product.id, qty });
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 1500);
    });
  }

  return (
    <article className="bg-[#f8f6f0] rounded-[20px] overflow-hidden flex flex-col transition-transform hover:-translate-y-1">
      {/* Image Wrapper */}
      <Link href={href} className="block relative w-full h-[220px]">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={optimizedImage(product.imageUrl, 400)} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center" style={{ background: tint(product.category) }}>
            <span className="text-5xl font-bold text-velvet/40">{product.brand.charAt(0)}</span>
          </div>
        )}
        <div className="absolute bottom-[15px] left-[15px] bg-white/80 backdrop-blur-[4px] px-[10px] py-[4px] rounded-[12px] text-[0.7rem] font-semibold text-[#c0a887]">
          {product.state === "in" ? "IN STOCK" : product.state === "low" ? "LOW STOCK" : "OUT"}
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-[24px] flex flex-col flex-grow">
        <Link href={href} className="block group/link">
          <h4 className="text-[0.9rem] font-semibold mb-[8px] text-[#3b3531] font-display line-clamp-1 group-hover/link:text-[#c0a887] transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-[0.75rem] text-[#8c837a] leading-relaxed mb-[24px] flex-grow line-clamp-2">
          {product.brand} · Premium supply per {product.unit}
        </p>

        {/* Card Footer */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex justify-between items-center">
            <span className="text-[0.85rem] font-semibold text-[#3b3531]">
              {formatMoney(product.priceCents)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-full shrink-0 bg-white">
              <button
                onClick={() => setQty((n) => Math.max(1, n - 1))}
                className="w-8 h-8 grid place-items-center text-gray-500 hover:text-black transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center text-xs font-semibold tabular-nums">{qty}</span>
              <button
                onClick={() => setQty((n) => Math.min(max, n + 1))}
                className="w-8 h-8 grid place-items-center text-gray-500 hover:text-black transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button 
              onClick={add}
              disabled={pending}
              className={`flex-1 px-4 h-8 rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                isRequirement ? "bg-[#c0a887] text-white hover:bg-black" : "bg-black text-white hover:bg-[#c0a887]"
              }`}
              aria-label={isRequirement ? "Request" : "Add to cart"}
            >
              {added ? "Added ✓" : isRequirement ? "Request" : "Add to Cart →"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
