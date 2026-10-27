import { prisma } from "@/lib/db/prisma";
import { MediaManager } from "./MediaManager";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 120 });

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-accent-700">Konten</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold text-primary md:text-3xl">Media</h1>
        <p className="mt-1 text-sm text-neutral-500">Pustaka gambar dan dokumen untuk katalog, artikel, dan portofolio.</p>
      </div>
      <MediaManager
        initial={media.map((item) => ({
          id: item.id,
          url: item.url,
          filename: item.filename,
          mimeType: item.mimeType,
          size: item.size,
          createdAt: item.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
