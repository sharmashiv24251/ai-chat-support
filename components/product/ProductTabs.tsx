"use client";

import { useState } from "react";
import { ProductTabs as ProductTabsType } from "@/lib/types";

interface ProductTabsProps {
  tabs: ProductTabsType;
}

type TabKey = "description" | "specs" | "warranty";

export default function ProductTabs({ tabs }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("description");

  const tabConfig: { key: TabKey; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "specs", label: "Specifications" },
    { key: "warranty", label: "Warranty" },
  ];

  return (
    <div className="mt-20 max-w-4xl">
      {/* Tab Headers */}
      <div className="flex items-center gap-8 border-b border-neutral-200/60 pb-1">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm font-medium pb-3 border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8 text-neutral-600 font-light leading-relaxed max-w-2xl transition-opacity duration-300">
        {tabs[activeTab]}
      </div>
    </div>
  );
}
