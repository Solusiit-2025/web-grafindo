import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { prisma } from "@/lib/db/prisma";
import { siteConfig } from "@/config/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_WIDTH = 841.89;
const PAGE_HEIGHT = 595.28;
const MARGIN = 40;

const colors = {
  ink: rgb(0.06, 0.067, 0.082),
  navy: rgb(0.02, 0.043, 0.18),
  blue: rgb(0.078, 0.337, 1),
  gold: rgb(0.79, 0.635, 0.294),
  muted: rgb(0.42, 0.45, 0.51),
  line: rgb(0.88, 0.9, 0.93),
  surface: rgb(0.96, 0.97, 0.99),
  white: rgb(1, 1, 1),
  success: rgb(0.18, 0.52, 0.35),
  warning: rgb(0.72, 0.47, 0.12),
  danger: rgb(0.77, 0.19, 0.19),
};

const availabilityLabel: Record<string, string> = {
  in_stock: "Tersedia",
  low_stock: "Terbatas",
  made_to_order: "Pre-order",
  out_of_stock: "Kosong",
};

const availabilityColor: Record<string, ReturnType<typeof rgb>> = {
  in_stock: colors.success,
  low_stock: colors.warning,
  made_to_order: colors.blue,
  out_of_stock: colors.danger,
};

function currency(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(Math.round(value))}`;
}

function fit(text: string, font: { widthOfTextAtSize: (text: string, size: number) => number }, size: number, maxWidth: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (font.widthOfTextAtSize(clean, size) <= maxWidth) return clean;
  let value = clean;
  while (value.length > 3 && font.widthOfTextAtSize(`${value}…`, size) > maxWidth) {
    value = value.slice(0, -1);
  }
  return `${value}…`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("cat");
  const query = searchParams.get("q");

  const entries = await prisma.ecatalogEntry.findMany({
    where: {
      ...(category ? { product: { category: { slug: category } } } : {}),
      ...(query
        ? {
            OR: [
              { sku: { contains: query, mode: "insensitive" } },
              { product: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { product: { include: { category: true } } },
    orderBy: [{ product: { category: { name: "asc" } } }, { sku: "asc" }],
  });

  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const generatedAt = new Date();

  // ----------------------------- Cover page -----------------------------
  const cover = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  cover.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: colors.navy });

  // Decorative grid
  for (let x = 0; x < PAGE_WIDTH; x += 42) {
    cover.drawLine({ start: { x, y: 0 }, end: { x, y: PAGE_HEIGHT }, thickness: 0.4, color: rgb(1, 1, 1), opacity: 0.035 });
  }
  for (let y = 0; y < PAGE_HEIGHT; y += 42) {
    cover.drawLine({ start: { x: 0, y }, end: { x: PAGE_WIDTH, y }, thickness: 0.4, color: rgb(1, 1, 1), opacity: 0.035 });
  }
  cover.drawCircle({ x: PAGE_WIDTH - 70, y: PAGE_HEIGHT - 60, size: 180, color: colors.blue, opacity: 0.18 });

  // Logo mark approximation (blue G ring) + wordmark
  cover.drawCircle({
    x: 72,
    y: PAGE_HEIGHT - 68,
    size: 22,
    borderColor: colors.blue,
    borderWidth: 7,
  });
  cover.drawRectangle({ x: 82, y: PAGE_HEIGHT - 69, width: 16, height: 6, color: colors.blue });
  cover.drawText("GRAFINDO", { x: 104, y: PAGE_HEIGHT - 70, size: 20, font: bold, color: colors.white });
  cover.drawText("MITRASEMESTA", { x: 105, y: PAGE_HEIGHT - 84, size: 7.5, font: bold, color: rgb(1, 1, 1), opacity: 0.55 });

  cover.drawText("E-CATALOG", {
    x: MARGIN,
    y: 360,
    size: 54,
    font: bold,
    color: colors.white,
  });
  cover.drawText("Spesifikasi & harga acuan untuk procurement", {
    x: MARGIN,
    y: 330,
    size: 16,
    font: regular,
    color: rgb(1, 1, 1),
    opacity: 0.62,
  });
  cover.drawRectangle({ x: MARGIN, y: 300, width: 70, height: 3, color: colors.gold });
  cover.drawText(siteConfig.legalName, { x: MARGIN, y: 270, size: 12, font: bold, color: colors.gold });
  cover.drawText(siteConfig.address.id, { x: MARGIN, y: 250, size: 9.5, font: regular, color: rgb(1, 1, 1), opacity: 0.55 });
  cover.drawText(`${siteConfig.email}  ·  ${siteConfig.phone}  ·  grafindomitrasemesta.com`, {
    x: MARGIN,
    y: 235,
    size: 9.5,
    font: regular,
    color: rgb(1, 1, 1),
    opacity: 0.55,
  });

  // Summary strip
  const summaryY = 145;
  cover.drawRectangle({ x: MARGIN, y: summaryY, width: PAGE_WIDTH - MARGIN * 2, height: 64, color: rgb(1, 1, 1), opacity: 0.05 });
  const summary = [
    { label: "TOTAL SKU", value: String(entries.length) },
    { label: "KATEGORI", value: String(new Set(entries.map((entry) => entry.product.category?.name).filter(Boolean)).size) },
    { label: "DIBUAT", value: generatedAt.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) },
    { label: "MATA UANG", value: "IDR" },
  ];
  summary.forEach((item, index) => {
    const x = MARGIN + 24 + index * ((PAGE_WIDTH - MARGIN * 2 - 48) / 4);
    cover.drawText(item.label, { x, y: summaryY + 40, size: 7, font: bold, color: rgb(1, 1, 1), opacity: 0.4 });
    cover.drawText(item.value, { x, y: summaryY + 18, size: 14, font: bold, color: colors.white });
  });

  cover.drawText("Harga belum termasuk PPN. Harga acuan; konfirmasi akhir melalui penawaran resmi.", {
    x: MARGIN,
    y: 72,
    size: 8,
    font: regular,
    color: rgb(1, 1, 1),
    opacity: 0.42,
  });
  cover.drawText("Dokumen ini dihasilkan otomatis oleh sistem GRAFINDO.", {
    x: MARGIN,
    y: 58,
    size: 8,
    font: regular,
    color: rgb(1, 1, 1),
    opacity: 0.3,
  });

  // ----------------------------- Table pages -----------------------------
  const columns = [
    { key: "sku", label: "SKU", x: MARGIN + 8, width: 90, font: mono },
    { key: "name", label: "PRODUK", x: MARGIN + 102, width: 230, font: regular },
    { key: "category", label: "KATEGORI", x: MARGIN + 336, width: 88, font: regular },
    { key: "price", label: "HARGA / UNIT", x: MARGIN + 428, width: 92, font: regular, align: "right" as const },
    { key: "moq", label: "MOQ", x: MARGIN + 524, width: 42, font: mono, align: "right" as const },
    { key: "lead", label: "LEAD TIME", x: MARGIN + 570, width: 70, font: regular },
    { key: "status", label: "STATUS", x: MARGIN + 644, width: 112, font: bold },
  ];

  const rowHeight = 22;
  const tableTop = PAGE_HEIGHT - 108;
  const tableBottom = 58;

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = tableTop;

  const drawPageHeader = (target: typeof page, pageNumber: number, totalPages: number) => {
    target.drawRectangle({ x: 0, y: PAGE_HEIGHT - 62, width: PAGE_WIDTH, height: 62, color: colors.ink });
    target.drawCircle({ x: MARGIN + 12, y: PAGE_HEIGHT - 32, size: 10, borderColor: colors.blue, borderWidth: 4 });
    target.drawRectangle({ x: MARGIN + 17, y: PAGE_HEIGHT - 35, width: 8, height: 3, color: colors.blue });
    target.drawText("GRAFINDO", { x: MARGIN + 30, y: PAGE_HEIGHT - 37, size: 12, font: bold, color: colors.white });
    target.drawText("E-Catalog · Spesifikasi & Harga Acuan", {
      x: MARGIN + 112,
      y: PAGE_HEIGHT - 35,
      size: 9,
      font: regular,
      color: rgb(1, 1, 1),
      opacity: 0.55,
    });
    target.drawText(`Halaman ${pageNumber} / ${totalPages}`, {
      x: PAGE_WIDTH - MARGIN - 80,
      y: PAGE_HEIGHT - 35,
      size: 9,
      font: regular,
      color: colors.white,
    });
  };

  const drawTableHeader = (target: typeof page) => {
    target.drawRectangle({
      x: MARGIN,
      y: y - 22,
      width: PAGE_WIDTH - MARGIN * 2,
      height: 22,
      color: colors.navy,
    });
    columns.forEach((column) => {
      target.drawText(column.label, {
        x: column.x,
        y: y - 14,
        size: 6.5,
        font: bold,
        color: colors.white,
      });
    });
    y -= 22;
  };

  drawTableHeader(page);

  entries.forEach((entry, index) => {
    if (y - rowHeight < tableBottom) {
      page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      y = tableTop;
      drawTableHeader(page);
    }
    const isZebra = index % 2 === 1;
    page.drawRectangle({
      x: MARGIN,
      y: y - rowHeight,
      width: PAGE_WIDTH - MARGIN * 2,
      height: rowHeight,
      color: isZebra ? colors.surface : colors.white,
    });
    page.drawLine({
      start: { x: MARGIN, y: y - rowHeight },
      end: { x: PAGE_WIDTH - MARGIN, y: y - rowHeight },
      thickness: 0.5,
      color: colors.line,
    });

    const values: Record<string, string> = {
      sku: entry.sku,
      name: entry.product.name,
      category: entry.product.category?.name ?? "—",
      price: currency(Number(entry.priceUnit)),
      moq: entry.product.moq != null ? String(entry.product.moq) : "—",
      lead: entry.product.leadTime ?? "—",
      status: availabilityLabel[entry.availability] ?? entry.availability,
    };

    columns.forEach((column) => {
      const value = values[column.key] ?? "";
      const size = column.key === "sku" ? 7.5 : 7.8;
      const text = fit(value, column.font, size, column.width - 8);
      const textWidth = column.font.widthOfTextAtSize(text, size);
      const x = column.align === "right" ? column.x + column.width - textWidth - 4 : column.x;
      page.drawText(text, {
        x,
        y: y - 15,
        size,
        font: column.font,
        color: column.key === "status" ? (availabilityColor[entry.availability] ?? colors.ink) : colors.ink,
      });
    });

    y -= rowHeight;
  });

  // Footer on every table page
  const pages = pdf.getPages();
  pages.forEach((target, index) => {
    if (index === 0) return;
    drawPageHeader(target, index, pages.length - 1);
    target.drawLine({
      start: { x: MARGIN, y: 46 },
      end: { x: PAGE_WIDTH - MARGIN, y: 46 },
      thickness: 0.5,
      color: colors.line,
    });
    target.drawText(`${siteConfig.legalName}  ·  ${siteConfig.email}  ·  ${siteConfig.phone}`, {
      x: MARGIN,
      y: 32,
      size: 7,
      font: regular,
      color: colors.muted,
    });
    target.drawText(`Dibuat ${generatedAt.toLocaleDateString("id-ID")} · Harga belum termasuk PPN`, {
      x: PAGE_WIDTH - MARGIN - 210,
      y: 32,
      size: 7,
      font: regular,
      color: colors.muted,
    });
  });

  const bytes = await pdf.save();
  const fileName = `GRAFINDO-E-Catalog-${generatedAt.toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
