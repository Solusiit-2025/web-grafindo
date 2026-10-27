"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Columns3, Download, FileSpreadsheet, Scale, Trash2, X } from "lucide-react";
import { Visual } from "./Visual";
import { AvailabilityBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils/cn";
import { formatCurrency } from "@/lib/utils/format";

export type CatalogRow = {
  id: string;
  sku: string;
  productId: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  categorySlug?: string | null;
  price: number;
  availability: string;
  priceValidUntil?: string | null;
  moq?: number | null;
  leadTime?: string | null;
  image?: string | null;
  specs: { label: string; value: string }[];
  tiers: { qty: string; price: number }[];
};

export function CatalogTable({
  rows,
  locale,
  pdfHref = "/api/ecatalog/pdf",
  labels,
}: {
  rows: CatalogRow[];
  locale: "id" | "en";
  pdfHref?: string;
  labels: {
    product: string;
    sku: string;
    category: string;
    price: string;
    availability: string;
    action: string;
    detail: string;
    compare: string;
    compareTitle: string;
    compareNote: string;
    compareSelected: string;
    compareOpen: string;
    compareClear: string;
    compareLimit: string;
    compareEmpty: string;
    exportExcel: string;
    validUntil: string;
    exportNote: string;
    mobileHint: string;
    moq: string;
    leadTime: string;
    specs: string;
  };
}) {
  const { toast } = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const selectedRows = useMemo(
    () => rows.filter((row) => selected.includes(row.id)),
    [rows, selected],
  );

  useEffect(() => {
    if (selected.length < 2 && compareOpen) setCompareOpen(false);
  }, [selected.length, compareOpen]);

  useEffect(() => {
    if (!compareOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCompareOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [compareOpen]);

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((entry) => entry !== id);
      if (current.length >= 4) {
        toast(labels.compareLimit, "error");
        return current;
      }
      return [...current, id];
    });
  }

  function exportCsv() {
    const header = ["SKU", "Product", "Category", "Price", "Availability", "MOQ", "Lead time"];
    const lines = rows.map((row) =>
      [
        row.sku,
        row.name,
        row.category ?? "",
        String(row.price),
        row.availability,
        row.moq ?? "",
        row.leadTime ?? "",
      ]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob(["\ufeff" + [header.join(","), ...lines].join("\r\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grafindo-e-catalog-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast(locale === "en" ? "Catalog exported." : "Katalog berhasil diexport.", "success");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <FileSpreadsheet className="h-4 w-4 text-accent-700" aria-hidden />
          {rows.length} SKU · {labels.exportNote}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
            <FileSpreadsheet className="h-3.5 w-3.5" aria-hidden />
            {labels.exportExcel}
          </Button>
          <a href={pdfHref} className="btn-dark btn-sm" download>
            <Download className="h-3.5 w-3.5" aria-hidden />
            PDF
          </a>
        </div>
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-hidden rounded-md border border-surface-200 md:block">
        <div className="max-h-[720px] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-primary text-white">
              <tr>
                <th className="w-10 px-3 py-3" aria-label="Pilih" />
                <th className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.product}</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.sku}</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.category}</th>
                <th className="px-4 py-3 text-right text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.price}</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.availability}</th>
                <th className="px-4 py-3 text-right text-[0.7rem] font-semibold uppercase tracking-[0.1em]">{labels.action}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const checked = selected.includes(row.id);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-t border-surface-200 transition",
                      index % 2 === 1 ? "bg-surface/50" : "bg-white",
                      checked && "bg-accent-50/70",
                    )}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(row.id)}
                        aria-label={`${labels.compare} ${row.name}`}
                        className="h-4 w-4 rounded border-surface-300 accent-accent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/e-catalog/${row.sku}`} className="group flex items-center gap-3">
                        <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-sm">
                          {row.image ? (
                            <Image src={row.image} alt={row.name} fill sizes="40px" className="object-cover" />
                          ) : (
                            <Visual category={row.categorySlug} alt={row.name} className="h-full w-full" showLabel={false} showMeta={false} />
                          )}
                        </span>
                        <span>
                          <span className="block font-medium text-primary transition group-hover:text-accent-700">{row.name}</span>
                          <span className="mt-0.5 block text-[0.65rem] text-neutral-400">
                            MOQ {row.moq ?? "—"} · {row.leadTime ?? "—"}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[0.7rem] text-neutral-500">{row.sku}</td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{row.category ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs font-medium text-primary">
                      {formatCurrency(row.price, locale === "en" ? "en-US" : "id-ID")}
                      {row.priceValidUntil && (
                        <span className="mt-0.5 block text-[0.58rem] font-sans font-normal text-neutral-400">
                          s/d {new Date(row.priceValidUntil).toLocaleDateString(locale === "en" ? "en-US" : "id-ID")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <AvailabilityBadge value={row.availability} locale={locale} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/e-catalog/${row.sku}`} className="btn-link text-xs">
                        {labels.detail}
                        <ArrowUpRight className="h-3 w-3" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 space-y-3 md:hidden">
        <p className="text-[0.65rem] text-neutral-400">{labels.mobileHint}</p>
        {rows.map((row) => {
          const checked = selected.includes(row.id);
          return (
            <div
              key={row.id}
              className={cn(
                "rounded-md border border-surface-200 bg-white p-3 shadow-e1",
                checked && "border-accent/50 bg-accent-50/40",
              )}
            >
              <div className="flex gap-3">
                <span className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                  {row.image ? (
                    <Image src={row.image} alt={row.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <Visual category={row.categorySlug} alt={row.name} className="h-full w-full" showLabel={false} showMeta={false} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/e-catalog/${row.sku}`} className="font-display text-sm font-bold leading-tight text-primary">
                      {row.name}
                    </Link>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(row.id)}
                      aria-label={`${labels.compare} ${row.name}`}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-surface-300 accent-accent"
                    />
                  </div>
                  <p className="mt-0.5 font-mono text-[0.6rem] text-neutral-400">{row.sku}</p>
                  <p className="mt-1 font-mono text-xs font-medium text-primary">
                    {formatCurrency(row.price, locale === "en" ? "en-US" : "id-ID")}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <AvailabilityBadge value={row.availability} locale={locale} />
                    {row.category && <Badge tone="outline">{row.category}</Badge>}
                  </div>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-surface-200 pt-2 text-[0.65rem] text-neutral-500">
                <span>MOQ {row.moq ?? "—"} · {row.leadTime ?? "—"}</span>
                <Link href={`/e-catalog/${row.sku}`} className="font-semibold text-secondary">
                  {labels.detail} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare bar */}
      {selected.length > 0 && (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto max-w-xl rounded-lg border border-primary/10 bg-primary px-4 py-3 text-white shadow-e3 sm:bottom-6 sm:left-6 sm:right-auto sm:mx-0 sm:w-full sm:max-w-md">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold">
                {labels.compareSelected.replace("{count}", String(selected.length))}
              </p>
              <p className="truncate text-[0.62rem] text-white/50">
                {selectedRows.map((row) => row.sku).join(" · ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelected([])}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/60 transition hover:text-white"
              aria-label={labels.compareClear}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            </button>
            <Button
              type="button"
              size="sm"
              disabled={selected.length < 2}
              onClick={() => setCompareOpen(true)}
            >
              <Columns3 className="h-3.5 w-3.5" aria-hidden />
              {labels.compareOpen}
            </Button>
          </div>
        </div>
      )}

      {/* Compare drawer */}
      {compareOpen && selectedRows.length >= 2 && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={labels.compareTitle}>
          <button type="button" aria-label="Tutup" className="absolute inset-0 bg-primary/70 backdrop-blur-sm" onClick={() => setCompareOpen(false)} />
          <div className="relative max-h-[88vh] w-full max-w-5xl overflow-y-auto rounded-t-xl border border-surface-200 bg-white p-5 shadow-e3 animate-fade-up sm:rounded-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-primary">{labels.compareTitle}</h2>
                <p className="mt-1 text-xs text-neutral-500">{labels.compareNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-300 text-neutral-500 transition hover:text-primary"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-36 px-3 py-3 text-left text-[0.65rem] uppercase tracking-[0.12em] text-neutral-400">
                      {labels.compare}
                    </th>
                    {selectedRows.map((row) => (
                      <th key={row.id} className="px-3 py-3 text-left align-top">
                        <span className="relative mb-2 block h-14 w-14 overflow-hidden rounded-sm">
                          {row.image ? (
                            <Image src={row.image} alt={row.name} fill sizes="56px" className="object-cover" />
                          ) : (
                            <Visual category={row.categorySlug} alt={row.name} className="h-full w-full" showLabel={false} showMeta={false} />
                          )}
                        </span>
                        <span className="block font-display text-sm font-bold leading-tight text-primary">{row.name}</span>
                        <button
                          type="button"
                          onClick={() => toggle(row.id)}
                          className="mt-1 text-[0.6rem] font-medium text-danger hover:underline"
                        >
                          {labels.compareClear}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: labels.sku, value: (row: CatalogRow) => row.sku, mono: true },
                    { label: labels.category, value: (row: CatalogRow) => row.category ?? "—" },
                    {
                      label: labels.price,
                      value: (row: CatalogRow) => formatCurrency(row.price, locale === "en" ? "en-US" : "id-ID"),
                      mono: true,
                    },
                    { label: labels.moq, value: (row: CatalogRow) => String(row.moq ?? "—"), mono: true },
                    { label: labels.leadTime, value: (row: CatalogRow) => row.leadTime ?? "—" },
                    { label: labels.availability, value: (row: CatalogRow) => row.availability },
                    {
                      label: labels.specs,
                      value: (row: CatalogRow) =>
                        row.specs.length > 0 ? row.specs.map((spec) => `${spec.label}: ${spec.value}`).join(" · ") : "—",
                    },
                  ].map((field) => (
                    <tr key={field.label} className="border-t border-surface-200">
                      <td className="px-3 py-3 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                        {field.label}
                      </td>
                      {selectedRows.map((row) => (
                        <td key={row.id} className={cn("px-3 py-3 align-top text-xs text-primary", field.mono && "font-mono")}>
                          {field.label === labels.availability ? (
                            <AvailabilityBadge value={row.availability} locale={locale} />
                          ) : (
                            field.value(row)
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-surface-200">
                    <td className="px-3 py-3" />
                    {selectedRows.map((row) => (
                      <td key={row.id} className="px-3 py-3">
                        <Link href={`/e-catalog/${row.sku}`} className="btn-dark btn-sm w-full">
                          {labels.detail}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
