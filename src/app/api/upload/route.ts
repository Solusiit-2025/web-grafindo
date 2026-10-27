import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/prisma";

export const runtime = "nodejs";

const MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "pdf", "ai", "eps", "svg"]);
const ALLOWED_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "application/postscript",
  "application/illustrator",
  "application/octet-stream",
]);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function rateLimited(key: string) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 12;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Terlalu banyak unggahan. Coba lagi sebentar." }, { status: 429 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Format permintaan tidak valid." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "File tidak ditemukan." }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Ukuran file melebihi 20MB." }, { status: 413 });
  }

  const extension = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: "Tipe file tidak diizinkan." }, { status: 415 });
  }
  if (file.type && !ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json({ error: "Tipe MIME file tidak diizinkan." }, { status: 415 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Basic signature checks for the most common formats (defence in depth).
  const signature = buffer.subarray(0, 4).toString("hex");
  const looksLikePdf = signature.startsWith("25504446");
  const looksLikePng = signature.startsWith("89504e47");
  const looksLikeJpeg = signature.startsWith("ffd8ff");
  const looksLikeWebp = buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  if ((extension === "pdf" && !looksLikePdf) || (extension === "png" && !looksLikePng) || (["jpg", "jpeg"].includes(extension) && !looksLikeJpeg) || (extension === "webp" && !looksLikeWebp)) {
    return NextResponse.json({ error: "Isi file tidak sesuai dengan ekstensinya." }, { status: 415 });
  }

  const filename = `${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);

  const url = `/uploads/${filename}`;

  try {
    await prisma.media.create({
      data: {
        url,
        filename: file.name.slice(0, 240),
        mimeType: file.type || "application/octet-stream",
        size: file.size,
      },
    });
  } catch (error) {
    console.error("Media record failed:", error);
  }

  return NextResponse.json({ url, filename, size: file.size });
}
