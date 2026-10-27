"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  FileText,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { submitQuoteAction } from "@/app/(public)/quote/actions";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/Toast";
import { waLink } from "@/config/site";
import type { Messages } from "@/i18n";
import { cn } from "@/lib/utils/cn";

type CategoryOption = { slug: string; name: string; count: number };
type ProductOption = { id: string; name: string; categorySlug?: string | null };
type ContactPref = "whatsapp" | "email" | "phone";

type FormState = {
  category: string;
  product: string;
  qty: string;
  size: string;
  material: string;
  finishing: string;
  deadline: string;
  notes: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  contactPref: ContactPref;
};

const STORAGE_KEY = "GRAFINDO.rfq.draft.v1";
const MAX_FILES = 5;
const MAX_SIZE = 20 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "application/pdf", "image/svg+xml", "application/postscript", "application/illustrator"];

export function QuoteForm({
  locale,
  categories,
  products,
  defaultCategory,
  defaultProduct,
  whatsappNumber,
  t,
  common,
}: {
  locale: "id" | "en";
  categories: CategoryOption[];
  products: ProductOption[];
  defaultCategory?: string;
  defaultProduct?: string;
  whatsappNumber: string;
  t: Messages["quote"];
  common: Messages["common"];
}) {
  const { toast } = useToast();
  const formTop = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [serverError, setServerError] = useState("");
  const [result, setResult] = useState<{ refNumber: string } | null>(null);

  const [data, setData] = useState<FormState>({
    category: defaultCategory ?? "",
    product: defaultProduct ?? "",
    qty: "",
    size: "",
    material: "",
    finishing: "",
    deadline: "",
    notes: "",
    name: "",
    company: "",
    email: "",
    phone: "",
    contactPref: "whatsapp",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<FormState> & { privacy?: boolean };
      setData((current) => ({
        ...current,
        ...saved,
        category: current.category || saved.category || "",
        product: current.product || saved.product || "",
      }));
      if (saved.privacy) setPrivacy(true);
    } catch {
      // ignore malformed drafts
    }
  }, []);

  useEffect(() => {
    if (result) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, privacy }));
      } catch {
        // storage may be full or blocked
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [data, privacy, result]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  const filteredProducts = data.category
    ? products.filter((product) => product.categorySlug === data.category)
    : products;

  function validateStep(current: number) {
    const next: Record<string, string> = {};
    if (current === 0) {
      if (!data.category) next.category = t.errors.category;
      if (!data.qty.trim()) next.qty = t.errors.qty;
    }
    if (current === 2) {
      if (!data.name.trim()) next.name = t.errors.required;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = t.errors.email;
      if (!/^[+\d][\d\s().-]{5,}$/.test(data.phone.trim())) next.phone = t.errors.phone;
    }
    return next;
  }

  function goNext() {
    const nextErrors = validateStep(step);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep((current) => Math.min(3, current + 1));
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    setFiles((current) => {
      const next = [...current];
      for (const file of incoming) {
        if (next.length >= MAX_FILES) {
          toast(t.errors.fileLimit, "error");
          break;
        }
        const typeOk = ACCEPTED.includes(file.type) || /\.(jpe?g|png|webp|pdf|ai|eps|svg)$/i.test(file.name);
        if (!typeOk) {
          toast(`${file.name}: ${t.errors.fileType}`, "error");
          continue;
        }
        if (file.size > MAX_SIZE) {
          toast(`${file.name}: ${t.errors.fileSize}`, "error");
          continue;
        }
        if (next.some((entry) => entry.name === file.name && entry.size === file.size)) continue;
        next.push(file);
      }
      return next;
    });
  }

  async function submit() {
    const allErrors = { ...validateStep(0), ...validateStep(2) };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      setStep(Object.keys(validateStep(0)).length > 0 ? 0 : 2);
      return;
    }
    if (!privacy) {
      setErrors({ privacy: t.errors.privacy });
      return;
    }

    setPending(true);
    setServerError("");
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body });
        if (!response.ok) throw new Error("upload");
        const payload = (await response.json()) as { url?: string };
        if (payload.url) uploaded.push(payload.url);
      }

      const formData = new FormData();
      (Object.keys(data) as (keyof FormState)[]).forEach((key) => formData.append(key, data[key]));
      formData.append("files", JSON.stringify(uploaded));
      formData.append("privacy", privacy ? "on" : "");

      const response = await submitQuoteAction(formData);
      if ("error" in response && response.error) {
        setServerError(response.error);
        toast(response.error, "error");
        return;
      }
      if ("success" in response && response.success) {
        setResult({ refNumber: response.refNumber });
        window.localStorage.removeItem(STORAGE_KEY);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setServerError(locale === "en" ? "Upload failed. Please try again." : "Upload gagal. Silakan coba lagi.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    const waText =
      locale === "en"
        ? `Hello GRAFINDO, I'd like to check the status of my RFQ ${result.refNumber}.`
        : `Halo GRAFINDO, saya ingin menanyakan status RFQ ${result.refNumber}.`;

    return (
      <div ref={formTop} className="rounded-xl border border-surface-200 bg-white p-6 text-center shadow-e2 sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success animate-fade-up">
          <Check className="h-8 w-8" aria-hidden />
        </span>
        <h2 className="mt-5 font-display text-2xl font-extrabold text-primary sm:text-3xl">{t.success.title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-600">{t.success.lead}</p>

        <div className="mx-auto mt-6 max-w-sm rounded-lg border border-accent/30 bg-accent-50/60 p-4">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-accent-700">{t.success.refLabel}</p>
          <p className="mt-1 break-all font-mono text-xl font-semibold tracking-wide text-primary">{result.refNumber}</p>
          <CopyButton value={result.refNumber} label={t.success.copyRef} className="mt-3" />
        </div>

        <p className="mt-4 text-xs text-neutral-500">{t.success.response}</p>
        <p className="text-xs text-neutral-400">{t.success.emailNote}</p>

        <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2">
          <a href={waLink(whatsappNumber, waText)} target="_blank" rel="noopener noreferrer" className="btn-dark">
            <MessageCircle className="h-4 w-4" aria-hidden />
            {t.success.whatsapp}
          </a>
          <Button type="button" variant="outline" onClick={() => { setResult(null); setStep(0); setFiles([]); setPrivacy(false); }}>
            {t.success.again}
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="mt-1 text-xs font-medium text-danger" role="alert">
        {errors[key]}
      </p>
    ) : null;

  const stepIcons = [FileText, CloudUpload, Phone, ShieldCheck];

  return (
    <div ref={formTop} className="rounded-xl border border-surface-200 bg-white p-5 shadow-e2 sm:p-7">
      {/* Stepper */}
      <ol className="flex items-start justify-between gap-1">
        {t.steps.map((label, index) => {
          const Icon = stepIcons[index];
          const active = index === step;
          const done = index < step;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <div className={cn("flex w-full items-center", index === 0 && "justify-end", index === t.steps.length - 1 && "justify-start")}>
                {index > 0 && <span className={cn("h-px flex-1", done || active ? "bg-accent" : "bg-surface-300")} aria-hidden />}
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition",
                    active
                      ? "border-accent bg-accent text-primary"
                      : done
                        ? "border-accent bg-white text-accent-700"
                        : "border-surface-300 bg-white text-neutral-400",
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : <Icon className="h-4 w-4" aria-hidden />}
                </span>
                {index < t.steps.length - 1 && <span className={cn("h-px flex-1", done ? "bg-accent" : "bg-surface-300")} aria-hidden />}
              </div>
              <span className={cn("mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] sm:text-[0.68rem]", active ? "text-primary" : "text-neutral-400")}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-center font-mono text-[0.62rem] uppercase tracking-[0.16em] text-neutral-400">
        {t.stepOf.replace("{current}", String(step + 1)).replace("{total}", "4")}
        <span className="ml-2 inline-flex items-center gap-1 text-neutral-300">
          <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
          {t.autosave}
        </span>
      </p>

      {serverError && (
        <div className="mt-4 rounded-sm border border-danger/20 bg-danger-50 px-3 py-2 text-xs text-danger" role="alert">
          {serverError}
        </div>
      )}

      <div className="mt-6">
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <p className="field-label">
                {t.fields.category} <span className="text-danger">*</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => {
                  const selected = data.category === category.slug;
                  return (
                    <button
                      key={category.slug}
                      type="button"
                      onClick={() => {
                        update("category", category.slug);
                        update("product", "");
                      }}
                      className={cn(
                        "rounded-md border p-3 text-left transition",
                        selected ? "border-accent bg-accent-50" : "border-surface-300 hover:border-accent/50",
                      )}
                    >
                      <span className="block font-display text-sm font-bold text-primary">{category.name}</span>
                      <span className="mt-0.5 block text-[0.65rem] text-neutral-500">{category.count} produk</span>
                    </button>
                  );
                })}
              </div>
              {fieldError("category")}
            </div>

            <div>
              <label htmlFor="rfq-product" className="field-label">{t.fields.product}</label>
              <input
                id="rfq-product"
                list="rfq-products"
                value={data.product}
                onChange={(event) => update("product", event.target.value)}
                placeholder={t.fields.productPlaceholder}
                className="field"
              />
              <datalist id="rfq-products">
                {filteredProducts.map((product) => (
                  <option key={product.id} value={product.name} />
                ))}
              </datalist>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="rfq-qty" className="field-label">
                  {t.fields.qty} <span className="text-danger">*</span>
                </label>
                <input
                  id="rfq-qty"
                  value={data.qty}
                  onChange={(event) => update("qty", event.target.value)}
                  placeholder="500"
                  className={cn("field", errors.qty && "field-error")}
                />
                <p className="field-hint">{t.fields.qtyHint}</p>
                {fieldError("qty")}
              </div>
              <div>
                <label htmlFor="rfq-size" className="field-label">{t.fields.size}</label>
                <input
                  id="rfq-size"
                  value={data.size}
                  onChange={(event) => update("size", event.target.value)}
                  placeholder={t.fields.sizePlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="rfq-material" className="field-label">{t.fields.material}</label>
                <input
                  id="rfq-material"
                  value={data.material}
                  onChange={(event) => update("material", event.target.value)}
                  placeholder={t.fields.materialPlaceholder}
                  className="field"
                />
              </div>
              <div>
                <label htmlFor="rfq-finishing" className="field-label">{t.fields.finishing}</label>
                <input
                  id="rfq-finishing"
                  value={data.finishing}
                  onChange={(event) => update("finishing", event.target.value)}
                  placeholder={t.fields.finishingPlaceholder}
                  className="field"
                />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div>
              <p className="field-label">{t.fields.files}</p>
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragging(false);
                  addFiles(event.dataTransfer.files);
                }}
                className={cn(
                  "rounded-md border-2 border-dashed p-6 text-center transition",
                  dragging ? "border-accent bg-accent-50" : "border-surface-300 bg-surface/50",
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.webp,.pdf,.ai,.eps,.svg"
                  className="sr-only"
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <CloudUpload className="mx-auto h-8 w-8 text-accent-700" aria-hidden />
                <p className="mt-2 text-sm font-semibold text-primary">
                  {locale === "en" ? "Drag files here or" : "Tarik file ke sini atau"}{" "}
                  <button type="button" onClick={() => inputRef.current?.click()} className="text-accent-700 underline underline-offset-2">
                    {locale === "en" ? "browse" : "pilih file"}
                  </button>
                </p>
                <p className="mt-1 text-[0.65rem] text-neutral-500">{t.fields.filesHint}</p>
              </div>

              {files.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${index}`} className="flex items-center gap-3 rounded-sm border border-surface-200 bg-white p-2.5">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt=""
                          className="h-10 w-10 rounded object-cover"
                          onLoad={(event) => URL.revokeObjectURL(event.currentTarget.src)}
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded bg-surface text-accent-700">
                          <FileText className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-medium text-primary">{file.name}</span>
                        <span className="block text-[0.6rem] text-neutral-400">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-danger-50 hover:text-danger"
                        aria-label={`Hapus ${file.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <label htmlFor="rfq-deadline" className="field-label">{t.fields.deadline}</label>
              <input
                id="rfq-deadline"
                type="date"
                value={data.deadline}
                onChange={(event) => update("deadline", event.target.value)}
                className="field sm:max-w-xs"
              />
            </div>

            <div>
              <label htmlFor="rfq-notes" className="field-label">{t.fields.notes}</label>
              <textarea
                id="rfq-notes"
                rows={4}
                value={data.notes}
                onChange={(event) => update("notes", event.target.value)}
                placeholder={t.fields.notesPlaceholder}
                className="field resize-y"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rfq-name" className="field-label">
                {t.fields.name} <span className="text-danger">*</span>
              </label>
              <input
                id="rfq-name"
                value={data.name}
                onChange={(event) => update("name", event.target.value)}
                className={cn("field", errors.name && "field-error")}
                autoComplete="name"
              />
              {fieldError("name")}
            </div>
            <div>
              <label htmlFor="rfq-company" className="field-label">{t.fields.company}</label>
              <input
                id="rfq-company"
                value={data.company}
                onChange={(event) => update("company", event.target.value)}
                className="field"
                autoComplete="organization"
              />
            </div>
            <div>
              <label htmlFor="rfq-email" className="field-label">
                {t.fields.email} <span className="text-danger">*</span>
              </label>
              <input
                id="rfq-email"
                type="email"
                value={data.email}
                onChange={(event) => update("email", event.target.value)}
                className={cn("field", errors.email && "field-error")}
                autoComplete="email"
              />
              {fieldError("email")}
            </div>
            <div>
              <label htmlFor="rfq-phone" className="field-label">
                {t.fields.phone} <span className="text-danger">*</span>
              </label>
              <input
                id="rfq-phone"
                value={data.phone}
                onChange={(event) => update("phone", event.target.value)}
                className={cn("field", errors.phone && "field-error")}
                inputMode="tel"
                autoComplete="tel"
              />
              {fieldError("phone")}
            </div>
            <div className="sm:col-span-2">
              <p className="field-label">{t.fields.contactPref}</p>
              <div className="flex flex-wrap gap-2">
                {(["whatsapp", "email", "phone"] as ContactPref[]).map((preference) => (
                  <button
                    key={preference}
                    type="button"
                    onClick={() => update("contactPref", preference)}
                    className={cn("chip", data.contactPref === preference && "chip-active")}
                  >
                    {preference === "whatsapp" ? <MessageCircle className="h-3.5 w-3.5" aria-hidden /> : preference === "email" ? <Mail className="h-3.5 w-3.5" aria-hidden /> : <Phone className="h-3.5 w-3.5" aria-hidden />}
                    {t.fields.contactOptions[preference]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-lg font-bold text-primary">{t.reviewTitle}</h2>
              <p className="mt-1 text-xs text-neutral-500">{t.reviewNote}</p>
            </div>

            <div className="space-y-3">
              <ReviewBlock title={t.steps[0]} onEdit={() => setStep(0)} editLabel={common.detail}>
                <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  <Row label={t.fields.category} value={categories.find((category) => category.slug === data.category)?.name ?? "—"} />
                  <Row label={t.fields.product} value={data.product || "—"} />
                  <Row label={t.fields.qty} value={data.qty} />
                  <Row label={t.fields.size} value={data.size || "—"} />
                  <Row label={t.fields.material} value={data.material || "—"} />
                  <Row label={t.fields.finishing} value={data.finishing || "—"} />
                </dl>
              </ReviewBlock>

              <ReviewBlock title={t.steps[1]} onEdit={() => setStep(1)} editLabel={common.detail}>
                <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  <Row label={t.fields.files} value={files.length > 0 ? `${files.length} file` : "—"} />
                  <Row label={t.fields.deadline} value={data.deadline || "—"} />
                  {data.notes && <Row label={t.fields.notes} value={data.notes} className="sm:col-span-2" />}
                </dl>
              </ReviewBlock>

              <ReviewBlock title={t.steps[2]} onEdit={() => setStep(2)} editLabel={common.detail}>
                <dl className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
                  <Row label={t.fields.name} value={data.name} />
                  <Row label={t.fields.company} value={data.company || "—"} />
                  <Row label={t.fields.email} value={data.email} />
                  <Row label={t.fields.phone} value={data.phone} />
                  <Row label={t.fields.contactPref} value={t.fields.contactOptions[data.contactPref]} />
                </dl>
              </ReviewBlock>
            </div>

            <label className={cn("flex cursor-pointer items-start gap-3 rounded-md border p-3 text-xs leading-relaxed", errors.privacy ? "border-danger bg-danger-50" : "border-surface-200 bg-surface/60")}>
              <input
                type="checkbox"
                checked={privacy}
                onChange={(event) => {
                  setPrivacy(event.target.checked);
                  setErrors((current) => {
                    const next = { ...current };
                    delete next.privacy;
                    return next;
                  });
                }}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-300 accent-accent"
              />
              <span className="text-neutral-600">
                {t.fields.privacy}{" "}
                <Link href="/privacy" className="font-semibold text-primary underline underline-offset-2">
                  {t.fields.privacyLink}
                </Link>
              </span>
            </label>
            {errors.privacy && <p className="text-xs font-medium text-danger">{errors.privacy}</p>}
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center justify-between gap-3 border-t border-surface-200 pt-5">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || pending}
          className={cn("btn-ghost btn-sm", step === 0 && "invisible")}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          {t.back}
        </button>

        {step < 3 ? (
          <Button type="button" onClick={goNext} iconRight={<ChevronRight className="h-4 w-4" aria-hidden />}>
            {t.next}
          </Button>
        ) : (
          <Button type="button" onClick={submit} disabled={pending} size="lg">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <ArrowRight className="h-4 w-4" aria-hidden />}
            {pending ? t.submitting : t.submit}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex gap-2", className)}>
      <dt className="w-24 shrink-0 text-xs text-neutral-400">{label}</dt>
      <dd className="min-w-0 flex-1 break-words font-medium text-primary">{value}</dd>
    </div>
  );
}

function ReviewBlock({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-surface-200 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-neutral-400">{title}</h3>
        <button type="button" onClick={onEdit} className="text-[0.65rem] font-semibold text-secondary hover:text-accent-700">
          {editLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
