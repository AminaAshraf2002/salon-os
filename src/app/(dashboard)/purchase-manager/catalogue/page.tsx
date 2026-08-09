import { requireScopedSession } from "@/lib/tenant";
import { reservedByProduct, availableOf, stockState } from "@/lib/stock";
import { ProductCard } from "./product-card";
import { FilterBar, Pagination, type SortKey } from "./filter-bar";

const PAGE_SIZE = 24;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; sort?: string; stock?: string; page?: string }>;
}) {
  const { session, db } = await requireScopedSession("PURCHASE_MANAGER");
  const { q, cat, sort, stock, page: pageParam } = await searchParams;

  const products = (await db.product.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  })).map(p => {
    // Normalize categories to merge duplicates
    let cat = p.category;
    if (cat.toLowerCase() === "haircare") cat = "Hair Care";
    if (cat.toLowerCase() === "skincare") cat = "Skin Care";
    return { ...p, category: cat };
  });

  const reserved = await reservedByProduct(session.orgId);

  const query = (q ?? "").trim().toLowerCase();
  let rows = products
    .filter((p) => {
      if (cat && cat !== "All" && p.category !== cat) return false;
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    })
    .map((p) => {
      const available = availableOf(p.stock, reserved.get(p.id) ?? 0);
      return {
        id: p.id,
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        category: p.category,
        unit: p.unit,
        imageUrl: p.imageUrl,
        priceCents: p.priceCents,
        available,
        state: stockState(available, p.minStock),
      };
    });

  if (stock === "in") rows = rows.filter((r) => r.state !== "out");

  const sortKey = (sort as SortKey) ?? "relevance";
  const sorted = [...rows];
  if (sortKey === "price-asc") sorted.sort((a, b) => a.priceCents - b.priceCents);
  else if (sortKey === "price-desc") sorted.sort((a, b) => b.priceCents - a.priceCents);
  else if (sortKey === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortKey === "stock") sorted.sort((a, b) => b.available - a.available);

  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pageCount);
  const cards = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const heading = query
    ? `Results for “${q}”`
    : cat && cat !== "All"
    ? cat
    : "All supplies";

  return (
    <div className="-mb-[2rem] md:-mb-[3rem]">
      {/* Hero Section */}
      <div className="relative w-[100vw] ml-[calc(50%-50vw)] h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden -mt-4 mb-16 flex bg-[#fbfaf8]">
        {/* Background Image Wrapper */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('/hero.png')" }}
          ></div>
          {/* Soft gradient overlay like the original but lighter */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf8] via-[#fbfaf8]/80 to-transparent w-full md:w-[60%]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col justify-center w-full md:w-[70%]">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#c0a887] uppercase mb-4">
            Professional Supplies
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-[56px] text-black leading-[1.1] tracking-wide max-w-[800px]" style={{ fontFamily: "var(--font-bebas)" }}>
            Premium Supplies.<br />Effortless Ordering.
          </h1>
          <p className="mt-6 text-[15px] text-black max-w-[600px] leading-[1.6]">
            Equip your salon with industry-leading products.<br />Wholesale pricing. Reliable delivery.
          </p>
          <div className="mt-[40px] flex items-center gap-4">
            <button className="px-[24px] py-[12px] rounded-md text-[11px] font-bold tracking-[0.1em] uppercase transition-colors shadow-sm bg-black text-white hover:bg-black/80 border-none flex items-center gap-2">
              Browse Catalogue
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          {/* Features in Hero */}
          <div className="mt-12 lg:mt-24 flex items-center gap-8">
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black shrink-0">
                <path d="M12 2v20"></path>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <span className="text-[9px] font-bold text-black uppercase tracking-wider leading-tight">Wholesale<br/>Pricing</span>
            </div>
            
            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black shrink-0">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span className="text-[9px] font-bold text-black uppercase tracking-wider leading-tight">Fast<br/>Delivery</span>
            </div>

            <div className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-black shrink-0">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <span className="text-[9px] font-bold text-black uppercase tracking-wider leading-tight">Premium<br/>Brands</span>
            </div>
          </div>
        </div>
      </div>

      <div className="md:px-4 lg:px-12">
        <div className="mb-12 w-full max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-[28px] text-[#1a1a1a]" style={{ fontFamily: "var(--font-bebas)", letterSpacing: "1px" }}>Browse Categories</h2>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-black border-b border-transparent hover:border-black transition-all">View All</a>
          </div>
          
          <div className="flex items-start gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x" style={{ WebkitOverflowScrolling: 'touch' }}>
            {Array.from(new Set(products.map(p => p.category))).sort().map((c, index) => {
                const isActive = c === cat;
                const qStr = new URLSearchParams();
                qStr.set("cat", c);
                const href = `/purchase-manager/catalogue?${qStr.toString()}`;

                const localImages: Record<string, string> = {
                  "Cleaning Supplies": "/Cleaning Supplies.png",
                  "Consumables": "/Consumables.png",
                  "Electrical": "/Electrical.png",
                  "Facial": "/Facial.png",
                  "Furniture": "/Furniture.png",
                  "Hair Care": "/Hair Care.png",
                  "Hair Colour": "/Hair Colour.png",
                  "Hair Treatments": "/Hair Treatments.png",
                  "Nail Care": "/Nail care.png",
                  "Retail Products": "/Retail Products.png",
                  "Waxing": "/Waxing.png",
                  "Hygiene": "/Hygiene.png",
                  "Linens": "/Linens.png",
                  "Manicure & Pedicure": "/Manicure Pedicure.png",
                  "Tools": "/tools.png",
                  "Equipment": "/Furniture.png",
                  "Skincare Supplies": "/Skincare.png",
                  "General Supplies": "/Cleaning Supplies.png",
                  "Skin Care": "/Skincare.png",
                  "Supplies": "/Cleaning Supplies.png"
                };

                let imageUrl = "/placeholder-category.png";
                for (const [key, path] of Object.entries(localImages)) {
                  if (c.toLowerCase().includes(key.toLowerCase())) {
                    imageUrl = path;
                    break;
                  }
                }

              return (
                <a 
                  key={index} 
                  href={href}
                  className="group relative flex flex-col items-center gap-3 snap-start shrink-0"
                >
                  <div className={`w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-[16px] overflow-hidden transition-all duration-300`}>
                    <img src={imageUrl} alt={c} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className={`text-sm md:text-[15px] font-medium text-center ${isActive ? 'text-black font-semibold' : 'text-[#333333] group-hover:text-black'}`}>
                    {c}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-[2.2rem] text-black tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>{heading}</h2>
        </div>

        <FilterBar total={total} showing={cards.length} heading="" />

        {cards.length === 0 ? (
          <div className="bg-surface border border-line rounded-sm mt-3 p-16 text-center">
            <p className="text-muted">
              No products match{query ? ` “${q}”` : ""}. Try a different search, category or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
              {cards.map((c) => (
                <ProductCard key={c.id} product={c} />
              ))}
            </div>
            <Pagination page={page} pageCount={pageCount} />
          </>
        )}
      </div>

      <div className="relative w-[100vw] ml-[calc(50%-50vw)] h-[350px] md:h-[450px] mt-16 md:mt-24 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed bg-no-repeat"
          style={{ backgroundImage: "url('/hero2.png')" }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl md:text-5xl text-white tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
            Elevate Your Salon Experience
          </h2>
          <p className="text-white/90 mt-4 text-[15px] md:text-lg max-w-[500px] mx-auto leading-relaxed">
            Discover our premium range of professional equipment and exclusive supplies designed for excellence.
          </p>
          <button className="mt-8 px-8 py-3 bg-white text-black text-xs font-bold tracking-[0.15em] uppercase hover:bg-gray-100 transition-colors shadow-lg">
            Shop Premium
          </button>
        </div>
      </div>

      <div className="relative w-[100vw] ml-[calc(50%-50vw)] bg-[#fbfaf8] flex flex-col lg:flex-row items-center justify-center py-16 md:py-20 gap-8 lg:gap-0">
        <div className="w-full lg:w-[45%] h-[350px] lg:h-[500px] px-6 lg:px-12">
          <div className="w-full h-full rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('/premium-salon-standard.png')] bg-cover bg-center"></div>
          </div>
        </div>
        
        <div className="w-full lg:w-[55%] px-8 md:px-16 lg:pr-24 lg:pl-12 flex flex-col justify-center">
          <div className="mb-10 md:mb-16">
            <span className="text-[#c0a887] text-[11px] font-bold tracking-[0.2em] uppercase mb-4 block">The Difference</span>
            <h2 className="text-3xl md:text-4xl text-black tracking-[0.05em] mb-4 md:mb-6" style={{ fontFamily: "var(--font-bebas)" }}>
              THE BEYOND DEMANDS STANDARD
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-[500px]">
              Elevating the salon wholesale experience with unmatched quality, exclusive access, and white-glove service.
            </p>
          </div>
          
          <div className="flex flex-col gap-10">
            <div className="flex gap-6 group">
              <div className="w-12 h-12 shrink-0 rounded-full bg-black flex items-center justify-center transition-all duration-500 group-hover:bg-[#c0a887]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>CURATED EXCELLENCE</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[400px]">
                  We source only the highest echelon of products from industry-leading brands, meticulously vetted for top-tier salons.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6 group">
              <div className="w-12 h-12 shrink-0 rounded-full bg-black flex items-center justify-center transition-all duration-500 group-hover:bg-[#c0a887]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>PRIORITY LOGISTICS</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[400px]">
                  Experience seamless inventory management with our white-glove, next-day delivery service tailored for professionals.
                </p>
              </div>
            </div>

            <div className="flex gap-6 group">
              <div className="w-12 h-12 shrink-0 rounded-full bg-black flex items-center justify-center transition-all duration-500 group-hover:bg-[#c0a887]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-black tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>FORTIFIED COMMERCE</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[400px]">
                  Your wholesale purchases are safeguarded with enterprise-grade security, ensuring complete peace of mind.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean "Let's Connect" Newsletter Section */}
      <div className="relative w-[100vw] ml-[calc(50%-50vw)] bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8">
          
          {/* Left Side: Heading and Text */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl tracking-wide mb-4">
              <span className="font-light text-gray-800">LET&apos;S </span>
              <span className="font-light text-[#c0a887]">CONNECT</span>
            </h2>
            <p className="text-gray-600 text-[15px] max-w-[400px] mx-auto md:mx-0">
              Stay updated with upcoming exclusive events, wholesale offers, and industry news or simply get in touch.
            </p>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start max-w-[500px]">
            <p className="text-gray-800 text-[15px] font-medium mb-4">You will get monthly newsletter</p>
            <div className="flex w-full">
              <input 
                type="email" 
                placeholder="Enter your email ID" 
                className="flex-1 border border-gray-300 text-gray-800 placeholder-gray-400 px-6 py-4 text-sm focus:outline-none focus:border-[#c0a887] transition-colors"
              />
              <button className="px-8 py-4 bg-[#c0a887] text-white text-sm font-bold tracking-[0.1em] uppercase hover:bg-black transition-colors shrink-0">
                SEND
              </button>
            </div>
          </div>
          
        </div>
      </div>

    </div>
  );
}
