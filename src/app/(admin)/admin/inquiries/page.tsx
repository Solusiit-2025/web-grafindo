import { prisma } from "@/lib/db/prisma";
import { InquiryBoard, type InquiryRow } from "./InquiryBoard";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });

  const rows: InquiryRow[] = inquiries.map((inquiry) => ({
    id: inquiry.id,
    refNumber: inquiry.refNumber,
    name: inquiry.name,
    company: inquiry.company,
    email: inquiry.email,
    phone: inquiry.phone,
    category: inquiry.category,
    status: inquiry.status,
    notes: inquiry.notes,
    files: inquiry.files,
    details: inquiry.details,
    createdAt: inquiry.createdAt.toISOString(),
  }));

  return <InquiryBoard inquiries={rows} />;
}
