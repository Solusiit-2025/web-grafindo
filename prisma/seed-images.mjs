import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productImages = {
  "die-cut-vinyl-sticker": [
    "/images/products/cat-stickers.jpg",
    "/images/products/die-cut-stickers.jpg",
  ],
  "clear-sticker": [
    "/images/products/clear-sticker-bottle.jpg",
    "/images/products/cat-stickers.jpg",
  ],
  "large-format-banner": [
    "/images/products/cat-graphics.jpg",
    "/images/products/motorcycle-graphics.jpg",
  ],
  "vinyl-sticker-roll": [
    "/images/products/vinyl-rolls.jpg",
    "/images/products/cat-stickers.jpg",
  ],
  "metal-emblem-badge": [
    "/images/products/cat-emblems.jpg",
    "/images/products/chrome-badges.jpg",
  ],
  "chrome-emblem": [
    "/images/products/hero-showcase.jpg",
    "/images/products/cat-emblems.jpg",
  ],
  "rubber-soft-emblem": [
    "/images/products/cat-soft-emblems.jpg",
    "/images/products/rubber-soft-emblems.jpg",
  ],
  "embroidered-patch": [
    "/images/products/cat-soft-emblems.jpg",
    "/images/products/rubber-soft-emblems.jpg",
  ],
};

const portfolioImages = {
  "branding-kopi-nusantara": ["/images/products/cat-stickers.jpg", "/images/products/clear-sticker-bottle.jpg"],
  "jersey-tim-sepakbola": ["/images/products/cat-soft-emblems.jpg", "/images/products/rubber-soft-emblems.jpg"],
  "signage-toko-retail": ["/images/products/cat-graphics.jpg", "/images/products/motorcycle-graphics.jpg"],
  "badge-kendaraan-premium": ["/images/products/hero-showcase.jpg", "/images/products/cat-emblems.jpg"],
  "label-kemasan-premium": ["/images/products/clear-sticker-bottle.jpg", "/images/products/cat-stickers.jpg"],
  "emblem-custom-motor": ["/images/products/cat-emblems.jpg", "/images/products/hero-showcase.jpg"],
};

const blogImages = {
  "memilih-material-sticker": "/images/products/cat-stickers.jpg",
  "perbedaan-emblem-metal-soft": "/images/products/hero-showcase.jpg",
  "tips-perawatan-sticker-outdoor": "/images/products/cat-graphics.jpg",
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
  // Clear and update product images
  await prisma.productImage.deleteMany();
  for (const [slug, images] of Object.entries(productImages)) {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) continue;
    await prisma.productImage.createMany({
      data: images.map((url, order) => ({ productId: product.id, url, alt: product.name, order })),
    });
  }

  for (const [slug, images] of Object.entries(portfolioImages)) {
    const item = await prisma.portfolio.findUnique({ where: { slug } });
    if (!item) continue;
    await prisma.portfolio.update({ where: { id: item.id }, data: { images } });
  }

  for (const [slug, image] of Object.entries(blogImages)) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) continue;
    await prisma.blogPost.update({ where: { id: post.id }, data: { featuredImage: image } });
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
