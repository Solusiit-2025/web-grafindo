export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId?: string | null;
  moq?: number | null;
  leadTime?: string | null;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
};
