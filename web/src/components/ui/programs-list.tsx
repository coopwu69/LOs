"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { Badge, StatusDot } from "./badge";
import { FormPickerDialog } from "./form-picker-dialog";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import type { Locale } from "@/lib/i18n";
import { FORM_NAMES } from "@/lib/form-names";

export type ProgramSummary = {
  id: string;
  key: string;
  code: string;
  name: string;
  href: string;
  companyHref: string;
  advisorHref: string;
  form_status: "submitted" | "pending";
};

type FilterKey = "all" | "available" | "pending";

const COPY = {
  th: {
    searchPlaceholder: "ค้นหาหลักสูตร รหัส หรือชื่อ…",
    all: "ทั้งหมด",
    available: "ส่งแล้ว",
    pending: "รอส่ง",
    code: "รหัส",
    program: "หลักสูตร",
    status: "สถานะ",
    forms: "แบบฟอร์ม",
    formCompany: "หน่วยงาน",
    formAdvisor: "อาจารย์นิเทศ",
    pickerHint: `คลิกหลักสูตรเพื่อเลือกระหว่าง${FORM_NAMES.th.company}และ${FORM_NAMES.th.advisor}`,
    openPicker: "เลือกแบบฟอร์ม",
    noResults: "ไม่พบหลักสูตรที่ตรงกับการค้นหา",
    noResultsHelp: "ลองเปลี่ยนคำค้นหาหรือตัวกรอง",
    availableLabel: "ส่งแล้ว",
    pendingLabel: "ยังไม่ส่ง",
  },
  en: {
    searchPlaceholder: "Search by code or program name…",
    all: "All",
    available: "Available",
    pending: "Pending",
    code: "Code",
    program: "Program",
    status: "Status",
    forms: "Forms",
    formCompany: "Workplace",
    formAdvisor: "Advisor",
    pickerHint: `Select a program, then choose between the "${FORM_NAMES.en.company}" and "${FORM_NAMES.en.advisor}" forms.`,
    openPicker: "Choose a form",
    noResults: "No programs match your search",
    noResultsHelp: "Try adjusting your search or filter",
    availableLabel: "Available",
    pendingLabel: "Not available",
  },
};

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

function ArrowRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

function FilterTab({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active ? "bg-action text-inverse" : "text-secondary hover:text-primary hover:bg-hover"
      }`}
    >
      {children}
      <span className={`rounded-full px-1.5 text-xs ${active ? "bg-inverse/20" : "bg-sunken"}`}>{count}</span>
    </button>
  );
}

export function ProgramsList({ programs, locale }: { programs: ProgramSummary[]; locale: Locale }) {
  const c = COPY[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  // The `pick` search param is the dialog's single source of truth: rows only
  // navigate the URL, and the dialog opens/closes in reaction to it. That makes
  // /schools/{slug}?pick={programKey} a shareable deep link and lets the
  // browser back button dismiss the dialog instead of leaving the page.
  const pickKey = searchParams.get("pick");
  const pickedProgram = useMemo(() => programs.find((p) => p.key === pickKey) ?? null, [programs, pickKey]);
  // Tracks whether this session pushed the `pick` entry — if so, closing pops
  // it via router.back(); if the user deep-linked straight here, the param is
  // stripped with router.replace() instead so back can't resurrect the dialog.
  const pushedPickRef = useRef(false);
  const navigatingToFormRef = useRef(false);

  const urlWith = useCallback((mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(window.location.search);
    mutate(params);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }, [pathname]);

  const openPicker = useCallback((program: ProgramSummary, trigger: HTMLElement) => {
    // Clicking a focusable row doesn't reliably move focus on every browser;
    // focus it so the dialog can hand focus back here on close.
    trigger.focus();
    pushedPickRef.current = true;
    router.push(urlWith((params) => params.set("pick", program.key)), { scroll: false });
  }, [router, urlWith]);

  const closePicker = useCallback(() => {
    // Leaving for a form page is a forward navigation, not a dismissal — never
    // answer it with history.back().
    if (navigatingToFormRef.current) {
      navigatingToFormRef.current = false;
      pushedPickRef.current = false;
      return;
    }
    // The dialog also reaches this through its `close` event after the URL
    // already lost `pick` (browser back/forward) — only touch history when the
    // URL still carries it.
    if (!new URLSearchParams(window.location.search).has("pick")) {
      pushedPickRef.current = false;
      return;
    }
    if (pushedPickRef.current) {
      pushedPickRef.current = false;
      router.back();
    } else {
      router.replace(urlWith((params) => params.delete("pick")), { scroll: false });
    }
  }, [router, urlWith]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filter === "available") return p.form_status === "submitted";
      if (filter === "pending") return p.form_status === "pending";
      return true;
    });
  }, [programs, query, filter]);

  const counts = useMemo(() => ({
    all: programs.length,
    available: programs.filter((p) => p.form_status === "submitted").length,
    pending: programs.filter((p) => p.form_status === "pending").length,
  }), [programs]);

  const formChips = (
    <>
      <Badge variant="neutral">{c.formCompany}</Badge>
      <Badge variant="neutral">{c.formAdvisor}</Badge>
    </>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            name="program-search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.searchPlaceholder}
            icon={<SearchIcon />}
            aria-label={c.searchPlaceholder}
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={c.status}>
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>{c.all}</FilterTab>
          <FilterTab active={filter === "available"} onClick={() => setFilter("available")} count={counts.available}>{c.available}</FilterTab>
          <FilterTab active={filter === "pending"} onClick={() => setFilter("pending")} count={counts.pending}>{c.pending}</FilterTab>
        </div>
      </div>
      <p className="text-sm text-tertiary">{c.pickerHint}</p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border-default bg-raised px-6 py-12 text-center">
          <p className="text-sm font-medium text-primary">{c.noResults}</p>
          <p className="mt-1 text-sm text-secondary">{c.noResultsHelp}</p>
        </div>
      ) : (
        <>
          {/* Desktop: data-dense table */}
          <Table className="hidden md:table">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-40">{c.code}</TableHead>
                <TableHead>{c.program}</TableHead>
                <TableHead className="w-32">{c.status}</TableHead>
                <TableHead className="w-52">{c.forms}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((program) => {
                const isAvailable = program.form_status === "submitted";
                return (
                  <TableRow
                    key={program.id}
                    className="group relative cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`${program.name} — ${c.openPicker}`}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a, button")) return;
                      openPicker(program, event.currentTarget);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      openPicker(program, event.currentTarget);
                    }}
                  >
                    <TableCell className="font-mono text-xs text-secondary whitespace-nowrap">{program.code}</TableCell>
                    <TableCell className="font-medium">
                      <span className="text-primary underline-offset-4 transition-colors group-hover:underline">{program.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isAvailable ? "success" : "warning"}>
                        <StatusDot variant={isAvailable ? "success" : "warning"} />
                        {isAvailable ? c.availableLabel : c.pendingLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">{formChips}</div>
                    </TableCell>
                    <TableCell className="text-tertiary" aria-hidden="true"><ArrowRightIcon /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Mobile: compact cards */}
          <div className="flex flex-col gap-2 md:hidden">
            {filtered.map((program) => {
              const isAvailable = program.form_status === "submitted";
              return (
                <button
                  key={program.id}
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(event) => openPicker(program, event.currentTarget)}
                  className="block w-full rounded-lg border border-border-default bg-raised p-3.5 text-left transition-colors hover:border-border-focus hover:bg-hover"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-tertiary">{program.code}</p>
                      <h3 className="mt-0.5 text-sm font-semibold text-primary leading-snug">{program.name}</h3>
                    </div>
                    <span className="flex-shrink-0 text-tertiary"><ArrowRightIcon /></span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant={isAvailable ? "success" : "warning"}>
                      <StatusDot variant={isAvailable ? "success" : "warning"} />
                      {isAvailable ? c.availableLabel : c.pendingLabel}
                    </Badge>
                    {formChips}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <FormPickerDialog
        program={pickedProgram}
        locale={locale}
        onClose={closePicker}
        onNavigate={() => { navigatingToFormRef.current = true; }}
      />
    </div>
  );
}
