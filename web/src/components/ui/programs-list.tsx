"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge, StatusDot } from "./badge";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import type { Locale } from "@/lib/i18n";

export type ProgramSummary = {
  id: string;
  code: string;
  name: string;
  href: string;
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
    noResults: "ไม่พบหลักสูตรที่ตรงกับการค้นหา",
    noResultsHelp: "ลองเปลี่ยนคำค้นหาหรือตัวกรอง",
    availableLabel: "ส่งแล้ว",
    pendingLabel: "ยังไม่ส่ง",
    copyLink: "คัดลอกลิงก์",
    linkCopied: "คัดลอกแล้ว",
    linkColumn: "ลิงก์",
  },
  en: {
    searchPlaceholder: "Search by code or program name…",
    all: "All",
    available: "Available",
    pending: "Pending",
    code: "Code",
    program: "Program",
    status: "Status",
    noResults: "No programs match your search",
    noResultsHelp: "Try adjusting your search or filter",
    availableLabel: "Available",
    pendingLabel: "Not available",
    copyLink: "Copy link",
    linkCopied: "Copied!",
    linkColumn: "Link",
  },
};

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>;
}

function ArrowRightIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" /></svg>;
}

function CopyIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}

function CheckIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>;
}

function CopyLinkButton({ href, copyLabel, copiedLabel }: { href: string; copyLabel: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = `${window.location.origin}${href}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      title={copied ? copiedLabel : copyLabel}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-hover ${copied ? "text-success-text" : "text-tertiary hover:text-primary"}`}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
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
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

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
                <TableHead className="w-10">{c.linkColumn}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((program) => {
                const isAvailable = program.form_status === "submitted";
                return (
                  <TableRow
                    key={program.id}
                    className="relative cursor-pointer focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus-ring)]"
                    role="link"
                    tabIndex={0}
                    aria-label={program.name}
                    onClick={(event) => {
                      if ((event.target as HTMLElement).closest("a, button")) return;
                      router.push(program.href);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") return;
                      event.preventDefault();
                      router.push(program.href);
                    }}
                  >
                    <TableCell className="font-mono text-xs text-secondary whitespace-nowrap">{program.code}</TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={program.href}
                        className="text-primary underline-offset-4 transition-colors hover:text-link hover:underline"
                      >
                        {program.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isAvailable ? "success" : "warning"}>
                        <StatusDot variant={isAvailable ? "success" : "warning"} />
                        {isAvailable ? c.availableLabel : c.pendingLabel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <CopyLinkButton href={program.href} copyLabel={c.copyLink} copiedLabel={c.linkCopied} />
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
                <Link
                  key={program.id}
                  href={program.href}
                  className="block rounded-lg border border-border-default bg-raised p-3.5 transition-colors hover:border-border-focus hover:bg-hover"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-tertiary">{program.code}</p>
                      <h3 className="mt-0.5 text-sm font-semibold text-primary leading-snug">{program.name}</h3>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1">
                      <CopyLinkButton href={program.href} copyLabel={c.copyLink} copiedLabel={c.linkCopied} />
                      <span className="text-tertiary"><ArrowRightIcon /></span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Badge variant={isAvailable ? "success" : "warning"}>
                      <StatusDot variant={isAvailable ? "success" : "warning"} />
                      {isAvailable ? c.availableLabel : c.pendingLabel}
                    </Badge>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
