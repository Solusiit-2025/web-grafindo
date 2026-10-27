import { redirect } from "next/navigation";

export default function ECatalogDownloadPage() {
  redirect("/api/ecatalog/pdf");
}
