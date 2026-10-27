import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productImages = {
  "die-cut-vinyl-sticker": [
    "/images/products/sticker-sheet-gt.png",
    "/images/products/beat-graphics.png",
    "/images/products/sticker-sheet-outline.png",
  ],
  "clear-sticker": [
    "/images/products/caution-label.png",
    "/images/products/blue-core-emblem.png",
  ],
  "large-format-banner": [
    "/images/products/motorcycle-graphics-1.jpg",
    "/images/products/sonic-graphics.png",
  ],
  "vinyl-sticker-roll": [
    "/images/products/sticker-sheet-red.png",
    "/images/products/r25-graphic.png",
  ],
  "metal-emblem-badge": [
    "/images/products/suzuki-emblem.jpg",
    "/images/products/s-shield-emblem.png",
  ],
  "chrome-emblem": [
    "/images/products/adx-150-emblem.jpg",
    "/images/products/scoopy-emblem.png",
  ],
  "rubber-soft-emblem": [
    "/images/products/adv-160-emblem.jpg",
    "/images/products/scoopy-soft-emblem.png",
  ],
  "embroidered-patch": [
    "/images/products/fox-s-emblem.png",
    "/images/products/blue-core-emblem.png",
  ],
};

const portfolioImages = {
  "branding-kopi-nusantara": ["/images/products/sticker-sheet-red.png", "/images/products/beat-graphics.png"],
  "jersey-tim-sepakbola": ["/images/products/adv-160-emblem.jpg", "/images/products/fox-s-emblem.png"],
  "signage-toko-retail": ["/images/products/motorcycle-graphics-2.jpg", "/images/products/sticker-sheet-gt.png"],
  "badge-kendaraan-premium": ["/images/products/adx-150-emblem.jpg", "/images/products/suzuki-emblem.jpg"],
  "label-kemasan-premium": ["/images/products/caution-label.png", "/images/products/sticker-sheet-outline.png"],
  "emblem-custom-motor": ["/images/products/s-shield-emblem.png", "/images/products/scoopy-emblem.png"],
};

const blogImages = {
  "memilih-material-sticker": "/images/products/sticker-sheet-gt.png",
  "perbedaan-emblem-metal-soft": "/images/products/fox-s-emblem.png",
  "tips-perawatan-sticker-outdoor": "/images/products/motorcycle-graphics-2.jpg",
};

const clients = [
  { name: "Astra Honda Motor", logoUrl: "/images/clients/ahm.png", order: 1 },
  { name: "Yamaha Indonesia", logoUrl: "/images/clients/yamaha.png", order: 2 },
  { name: "TVS Motor", logoUrl: "/images/clients/tvs.png", order: 3 },
  { name: "Suzuki Indonesia", logoUrl: "/images/clients/suzuki.png", order: 4 },
  { name: "Denso", logoUrl: "/images/clients/denso.png", order: 5 },
  { name: "Polytron", logoUrl: "/images/clients/polytron.png", order: 6 },
];

async function main() {
  for (const [slug, images] of Object.entries(productImages)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;
    const count = await prisma.productImage.count({ where: { productId: product.id } });
    if (count === 0) {
      await prisma.productImage.createMany({
        data: images.map((url, order) => ({ productId: product.id, url, alt: product.name, order })),
      });
    }
  }

  for (const [slug, images] of Object.entries(portfolioImages)) {
    const item = await prisma.portfolio.findUnique({ where: { slug } });
    if (!item) continue;
    if (item.images.length === 0) {
      await prisma.portfolio.update({ where: { id: item.id }, data: { images } });
    }
  }

  for (const [slug, image] of Object.entries(blogImages)) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) continue;
    if (!post.featuredImage) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { featuredImage: image } });
    }
  }

  await prisma.clientLogo.deleteMany();
  await prisma.clientLogo.createMany({ data: clients });

  console.log("Product/portfolio/blog/client images seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
