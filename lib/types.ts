// Product Types
export interface ProductVariants {
  colors?: string[];
  storage?: string[];
  sizes?: string[];
}

export interface ProductTabs {
  description: string;
  specs: string;
  warranty: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  currencySymbol: string;
  rating: number;
  inStock: boolean;
  description: string;
  images: string[];
  variants?: ProductVariants;
  tabs: ProductTabs;
  // Rich context for AI to understand the product
  aiContext: string;
  // Predefined questions for quick action chips
  predefinedQuestions: string[];
}

// Product summary for grid display
export interface ProductSummary {
  slug: string;
  name: string;
  category: string;
  price: number;
  currencySymbol: string;
  image: string;
}

// Website Info Types
export interface WebsiteInfo {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  shippingPolicy: string;
  returnPolicy: string;
  warrantyInfo: string;
  stockInfo: string;
  defaultChatChips: string[];
  // AI context about the website for general queries
  aiContext: string;
}

// Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
