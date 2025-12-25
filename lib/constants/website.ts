import { WebsiteInfo } from "../types";

export const websiteInfo: WebsiteInfo = {
  brandName: "BuyHard™",
  tagline: "Essence of Commerce",
  heroTitle: "Refined tech for clarity & focus.",
  heroSubtitle:
    "Curated essentials defined by performance and aesthetics. One AI assistant to guide your choice.",

  shippingPolicy: `We ship globally with the following options:
    - Standard Shipping: 5-7 business days (Free on orders over ₹1,000)
    - Express Shipping: 2-3 business days (₹199)
    - Same-day Delivery: Available in select metros (₹299)
    All orders are processed within 24 hours. Tracking provided via email.`,

  returnPolicy: `We offer a hassle-free 14-day return policy:
    - Items must be in original condition with tags attached
    - Electronics must be unopened for full refund
    - Opened electronics eligible for replacement only
    - Free return shipping on defective items
    - Refunds processed within 5-7 business days`,

  warrantyInfo: `Warranty coverage varies by product:
    - Electronics: 1-2 year manufacturer warranty
    - Footwear: 30-day wear test guarantee
    - Gaming: 1 year Sony warranty
    Extended warranty available at checkout.`,

  stockInfo:
    "Most items ship within 24 hours. Limited stock items are marked accordingly.",

  defaultChatChips: [
    "Order status",
    "Shipping info",
    "Best sellers",
    "Return policy",
  ],

  aiContext: `BuyHard™ is a premium e-commerce platform specializing in curated tech and lifestyle products.
    
    Brand positioning: Premium, minimalist, design-focused
    Target audience: Design-conscious consumers, tech enthusiasts, young professionals
    
    Key policies:
    - Free shipping on orders over ₹1,000
    - 14-day return window
    - Secure payments via all major cards and UPI
    - Customer support available 9 AM - 9 PM IST
    
    Product categories: Electronics, Gaming, Footwear, Accessories
    
    Unique selling points:
    - AI-powered shopping assistance
    - Curated product selection (quality over quantity)
    - Premium unboxing experience
    - Fast delivery in metro cities`,
};

// Mock responses for common queries (used before AI integration)
export const mockResponses: Record<string, string> = {
  shipping:
    "We ship globally. Free express shipping on all orders over ₹1,000. Standard delivery takes 5-7 business days.",
  ship: "We ship globally. Free express shipping on all orders over ₹1,000. Standard delivery takes 5-7 business days.",
  return:
    "You have 14 days to return items in their original condition. No questions asked. Free return shipping on defective items.",
  refund:
    "Refunds are processed within 5-7 business days after we receive the returned item.",
  stock:
    "Yes, we have limited stock available for immediate dispatch. Check product pages for real-time availability.",
  size: "Our sizes run true to standard measurements. Check the size guide on the product page for detailed measurements.",
  warranty:
    "Warranty varies by product: Electronics get 1-2 years, footwear has a 30-day wear test, gaming consoles have 1 year Sony warranty.",
  payment:
    "We accept all major credit/debit cards, UPI, net banking, and EMI options on select products.",
  order:
    "To check your order status, please provide your order ID or the email used during checkout.",
  track:
    "Once shipped, you will receive a tracking link via email. You can also check order status in your account.",
  cancel:
    "Orders can be cancelled within 2 hours of placement. After that, you can refuse delivery or initiate a return.",
  default:
    "I can help with shipping, returns, product details, or order status. What would you like to know?",
};

export function getMockResponse(query: string): string {
  const lower = query.toLowerCase();

  for (const [key, response] of Object.entries(mockResponses)) {
    if (lower.includes(key)) {
      return response;
    }
  }

  return mockResponses.default;
}
