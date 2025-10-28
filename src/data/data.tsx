interface Package {
  id: string;
  name: string;
  leadCount: string;
  description: string;
  priceUSD: number;
  category: "small" | "medium" | "large" | "bonus" | "premium";
}
const packages: Package[] = [
  {
    id: "coaches",
    name: "Coaches and Consultants",
    leadCount: "~500K",
    description: "Verified & segmented U.S. leads for Coaches and Consultants",
    priceUSD: 39,
    category: "small",
  },
  {
    id: "corporates",
    name: "Corporates",
    leadCount: "~1M",
    description: "Verified & segmented U.S. leads for Corporates",
    priceUSD: 79,
    category: "large",
  },
  {
    id: "creative",
    name: "Creative Professionals",
    leadCount: "~400K",
    description: "Verified & segmented U.S. leads for Creative Professionals",
    priceUSD: 39,
    category: "small",
  },
  {
    id: "founder-ceo",
    name: "Founder & CEO (Affiliate Marketing)",
    leadCount: "~600K",
    description:
      "Verified & segmented U.S. leads for Founder & CEO (Affiliate Marketing)",
    priceUSD: 59,
    category: "medium",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    leadCount: "~800K",
    description: "Verified & segmented U.S. leads for Healthcare",
    priceUSD: 59,
    category: "medium",
  },
  {
    id: "insurance",
    name: "Insurance Company",
    leadCount: "~1.2M",
    description: "Verified & segmented U.S. leads for Insurance Company",
    priceUSD: 79,
    category: "large",
  },
  {
    id: "it-company",
    name: "IT Company",
    leadCount: "~500K",
    description: "Verified & segmented U.S. leads for IT Company",
    priceUSD: 39,
    category: "small",
  },
  {
    id: "legal",
    name: "Legal",
    leadCount: "~700K",
    description: "Verified & segmented U.S. leads for Legal",
    priceUSD: 59,
    category: "medium",
  },
  {
    id: "marketing-agency",
    name: "Marketing Agency",
    leadCount: "~900K",
    description: "Verified & segmented U.S. leads for Marketing Agency",
    priceUSD: 79,
    category: "large",
  },
  {
    id: "real-estate",
    name: "Real Estate",
    leadCount: "~1.5M",
    description: "Verified & segmented U.S. leads for Real Estate",
    priceUSD: 59,
    category: "medium",
  },
  {
    id: "sales-manager",
    name: "Sales Manager",
    leadCount: "~600K",
    description: "Verified & segmented U.S. leads for Sales Manager",
    priceUSD: 59,
    category: "medium",
  },
  {
    id: "software-company",
    name: "Software Company",
    leadCount: "~800K",
    description: "Verified & segmented U.S. leads for Software Company",
    priceUSD: 79,
    category: "large",
  },
  {
    id: "bonus-2",
    name: "🔥 Bonus 2",
    leadCount: "~6M mixed",
    description: "Comprehensive mixed category leads package",
    priceUSD: 149,
    category: "bonus",
  },
  {
    id: "bonus-3",
    name: "🆕 Bonus 3",
    leadCount: "~8M from Jay",
    description: "Premium curated leads collection",
    priceUSD: 199,
    category: "bonus",
  },
  {
    id: "usa-consumers",
    name: "🚀 3.5 Million USA Consumers",
    leadCount: "~3.5M mixed",
    description: "Diverse consumer leads across multiple segments",
    priceUSD: 149,
    category: "bonus",
  },
];
const currencies = [
  {
    code: "USD",
    symbol: "$",
    rate: 1,
    name: "US Dollar",
  },
  {
    code: "EUR",
    symbol: "€",
    rate: 0.92,
    name: "Euro",
  },
  {
    code: "GBP",
    symbol: "£",
    rate: 0.79,
    name: "British Pound",
  },
  {
    code: "BDT",
    symbol: "৳",
    rate: 110,
    name: "Bangladeshi Taka",
  },
  {
    code: "INR",
    symbol: "₹",
    rate: 83,
    name: "Indian Rupee",
  },
  {
    code: "CAD",
    symbol: "C$",
    rate: 1.35,
    name: "Canadian Dollar",
  },
  {
    code: "AUD",
    symbol: "A$",
    rate: 1.52,
    name: "Australian Dollar",
  },
];
export { packages, currencies };
