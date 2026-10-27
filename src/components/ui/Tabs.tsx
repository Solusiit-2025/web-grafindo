"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type TabItem = { id: string; label: string; content: ReactNode };

export function Tabs({ items, defaultValue, className }: { items: TabItem[]; defaultValue?: string; className?: string }) {
  const [active, setActive] = useState(defaultValue ?? items[0]?.id);

  return (
    <div className={className}>
      <div role="tablist" aria-label="Product information" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-surface-200">
        {items.map((item) => {
          const selected = active === item.id;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`tabpanel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => setActive(item.id)}
              className={cn(
                "relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition",
                selected ? "text-primary" : "text-neutral-500 hover:text-primary",
              )}
            >
              {item.label}
              <span
                className={cn(
                  "absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent transition-opacity",
                  selected ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`tabpanel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={active !== item.id}
          className="py-6"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
