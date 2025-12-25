import { Product } from "../types";

export const products: Product[] = [
  {
    slug: "nike-zoom-velocity",
    name: "Nike Zoom Velocity",
    category: "Footwear",
    price: 9999,
    currency: "INR",
    currencySymbol: "₹",
    rating: 4.5,
    inStock: true,
    description:
      "Engineered for propulsion. The Zoom Velocity combines responsive cushioning with a featherlight upper, making every stride feel effortless.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: {
      colors: ["Red", "Black", "White"],
      sizes: ["UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
    },
    tabs: {
      description:
        "Lightweight uppers, responsive cushioning, and grippy outsoles—perfect for daily runs and weekend flexing. The Nike Zoom Velocity is designed for athletes who demand performance without compromising on style.",
      specs:
        "Mesh Upper • ZoomX Foam • 250g weight • 8mm drop • Rubber outsole • Breathable lining",
      warranty:
        "30-day wear test. Free returns. 1-year manufacturing defect warranty.",
    },
    aiContext: `Nike Zoom Velocity is a premium running shoe from Nike's performance line. 
    Key features: ZoomX foam technology for energy return, lightweight mesh upper for breathability, 
    8mm heel-to-toe drop ideal for neutral runners. Weight: 250g per shoe (US size 9).
    Best for: Daily training, tempo runs, and casual wear.
    Price point: Mid-range performance shoe.
    Competitors: Adidas Ultraboost, New Balance FuelCell, ASICS Gel-Nimbus.
    Available in India through official Nike stores and authorized retailers.`,
    predefinedQuestions: [
      "Is it true to size?",
      "Good for marathons?",
      "Return policy?",
      "Available sizes?",
    ],
  },
  {
    slug: "iphone-16",
    name: "iPhone 16",
    category: "Electronics",
    price: 79999,
    currency: "INR",
    currencySymbol: "₹",
    rating: 4.9,
    inStock: true,
    description:
      "A marvel of engineering. Faster processing, intelligent camera systems, and a battery that keeps up with your life. The essential device for the modern creator.",
    images: [
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1472132858735-6313c7962473?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1200&auto=format&fit=crop",
    ],
    variants: {
      colors: ["Black", "Blue", "White"],
      storage: ["128GB", "256GB"],
    },
    tabs: {
      description:
        "The iPhone 16 brings a blazing-fast chip, enhanced cameras, and stellar battery life in a refined design. Choose your storage and color, and let our AI help you pick the right combo.",
      specs:
        'A18 chip • 6.3" Super Retina XDR display • Dual 48MP camera system • 5G capable • Face ID • USB‑C • Up to 22 hours video playback',
      warranty:
        "1-year Apple warranty. Returns within 14 days. AppleCare+ available.",
    },
    aiContext: `iPhone 16 is Apple's latest flagship smartphone released in 2024.
    Key specifications:
    - Chip: A18 Bionic (3nm process)
    - Display: 6.3" Super Retina XDR OLED, 2556x1179 pixels
    - Camera: Dual 48MP + 12MP system with Photonic Engine
    - Storage options: 128GB, 256GB (no expandable storage)
    - Battery: Up to 22 hours video playback
    - Connectivity: 5G, Wi-Fi 6E, Bluetooth 5.3, USB-C
    - Colors: Black, Blue, White, Pink, Green
    - Water resistance: IP68
    Price in India: ₹79,999 (128GB), ₹89,999 (256GB)
    Competitors: Samsung Galaxy S24, Google Pixel 8, OnePlus 12.`,
    predefinedQuestions: [
      "Camera details?",
      "Battery life?",
      "Shipping time?",
      "256GB price?",
    ],
  },
  {
    slug: "playstation-5",
    name: "PlayStation 5",
    category: "Gaming",
    price: 49999,
    currency: "INR",
    currencySymbol: "₹",
    rating: 4.8,
    inStock: true,
    description:
      "Immerse yourself in worlds that feel real. With haptic feedback, adaptive triggers, and 3D Audio, the PS5 redefines what gaming feels like.",
    images: [
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg",
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/c543a9e1-f226-4ced-80b0-feb8445a75b9_1600w.jpg",
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/5bab247f-35d9-400d-a82b-fd87cfe913d2_1600w.webp",
      "https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/30104e3c-5eea-4b93-93e9-5313698a7156_1600w.webp",
    ],
    variants: {
      colors: ["Standard Edition", "Digital Edition"],
    },
    tabs: {
      description:
        "Custom SSD for ultra-fast loading, 4K visuals, and adaptive triggers that change how games feel. Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback.",
      specs:
        "825GB Custom SSD • 4K @ 120Hz • Ray Tracing • Tempest 3D AudioTech • 8K output support • Backward compatible with PS4 games",
      warranty: "1-year Sony warranty. Extended warranty available.",
    },
    aiContext: `PlayStation 5 is Sony's current-generation gaming console released in 2020.
    Key specifications:
    - CPU: AMD Zen 2 based, 8 cores at 3.5GHz
    - GPU: Custom RDNA 2, 10.28 TFLOPs
    - Storage: 825GB custom NVMe SSD (expandable via M.2 slot)
    - Resolution: Up to 4K @ 120Hz, 8K support
    - Features: Ray tracing, haptic feedback, adaptive triggers, Tempest 3D Audio
    - Editions: Standard (with disc drive) and Digital (download only)
    Price in India: ₹49,999 (Digital), ₹54,990 (Standard)
    Popular games: Spider-Man 2, God of War Ragnarok, Horizon Forbidden West
    Competitors: Xbox Series X, Nintendo Switch, PC gaming.`,
    predefinedQuestions: [
      "Digital vs Disc?",
      "Controller included?",
      "Warranty details?",
      "Stock availability?",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductSummaries() {
  return products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    currencySymbol: p.currencySymbol,
    image: p.images[0],
  }));
}
