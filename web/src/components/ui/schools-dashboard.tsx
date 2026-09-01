"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, StatusDot } from "./badge";
import { Input } from "./input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import type { Locale } from "@/lib/i18n";

export type SchoolSummary = {
  name: string;
  displayName: string;
  href: string;
  program_count: number;
  submitted_count: number;
  pending_count: number;
  standard_4_count: number;
  legacy_5_count: number;
  needs_descriptions_count: number;
};

type FilterKey = "all" | "needs_attention" | "ready";

const COPY = {
  th: {
    searchPlaceholder: "ค้นหาสำนักวิชา…",
    all: "ทั้งหมด",
    needsAttention: "ต้องดำเนินการ",
    ready: "พร้อมใช้งาน",
    school: "สำนักวิชา",
    programs: "หลักสูตร",
    available: "ส่งแล้ว",
    pending: "รอส่ง",
    scaleStatus: "สถานะเกณฑ์คะแนน",
    noResults: "ไม่พบสำนักวิชาที่ตรงกับการค้นหา",
    noResultsHelp: "ลองเปลี่ยนคำค้นหาหรือตัวกรอง",
    standard4: "4 ระดับ",
    legacy5: "5 ระดับเดิม",
    needsDesc: "ต้องเพิ่มคำอธิบาย",
    programsUnit: "หลักสูตร",
  },
  en: {
    searchPlaceholder: "Search schools…",
    all: "All",
    needsAttention: "Needs attention",
    ready: "Ready",
    school: "School",
    programs: "Programs",
    available: "Available",
    pending: "Pending",
    scaleStatus: "Scale status",
    noResults: "No schools match your search",
    noResultsHelp: "Try adjusting your search or filter",
    standard4: "4-level",
    legacy5: "Legacy 5-level",
    needsDesc: "Needs descriptions",
    programsUnit: "programs",
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

function ScaleBadges({ school, c }: { school: SchoolSummary; c: typeof COPY.th }) {
  const hasScaleInfo = school.standard_4_count > 0 || school.legacy_5_count > 0 || school.needs_descriptions_count > 0;
  if (!hasScaleInfo) return <span className="text-tertiary text-xs">—</span>;
  return (
    <div className="flex flex-wrap gap-1">
      {school.standard_4_count > 0 && <Badge variant="success" title={`${school.standard_4_count} ${c.programsUnit} — ${c.standard4}`}>{c.standard4} {school.standard_4_count}</Badge>}
      {school.legacy_5_count > 0 && <Badge variant="warning" title={`${school.legacy_5_count} ${c.programsUnit} — ${c.legacy5}`}>{c.legacy5} {school.legacy_5_count}</Badge>}
      {school.needs_descriptions_count > 0 && <Badge variant="error" title={`${school.needs_descriptions_count} ${c.programsUnit} — ${c.needsDesc}`}>{c.needsDesc} {school.needs_descriptions_count}</Badge>}
    </div>
  );
}

export function SchoolsDashboard({ schools, locale }: { schools: SchoolSummary[]; locale: Locale }) {
  const c = COPY[locale];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return schools.filter((s) => {
      const matchesQuery = !q || s.displayName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
      if (!matchesQuery) return false;
      if (filter === "needs_attention") return s.pending_count > 0 || s.legacy_5_count > 0 || s.needs_descriptions_count > 0;
      if (filter === "ready") return s.pending_count === 0 && s.legacy_5_count === 0 && s.needs_descriptions_count === 0;
      return true;
    });
  }, [schools, query, filter]);

  const counts = useMemo(() => ({
    all: schools.length,
    needs_attention: schools.filter((s) => s.pending_count > 0 || s.legacy_5_count > 0 || s.needs_descriptions_count > 0).length,
    ready: schools.filter((s) => s.pending_count === 0 && s.legacy_5_count === 0 && s.needs_descriptions_count === 0).length,
  }), [schools]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search + filter controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            type="search"
            name="school-search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.searchPlaceholder}
            icon={<SearchIcon />}
            aria-label={c.searchPlaceholder}
          />
        </div>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label={c.scaleStatus}>
          <FilterTab active={filter === "all"} onClick={() => setFilter("all")} count={counts.all}>{c.all}</FilterTab>
          <FilterTab active={filter === "needs_attention"} onClick={() => setFilter("needs_attention")} count={counts.needs_attention}>{c.needsAttention}</FilterTab>
          <FilterTab active={filter === "ready"} onClick={() => setFilter("ready")} count={counts.ready}>{c.ready}</FilterTab>
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
                <TableHead>{c.school}</TableHead>
                <TableHead className="text-right">{c.programs}</TableHead>
                <TableHead className="text-right">{c.available}</TableHead>
                <TableHead className="text-right">{c.pending}</TableHead>
                <TableHead>{c.scaleStatus}</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((school) => {
                const statusVariant = school.pending_count > 0 ? "warning" : "success";
                return (
                  <TableRow key={school.name} className="relative cursor-pointer">
                    <TableCell className="font-medium">
                      <Link
                        href={school.href}
                        className="text-primary underline-offset-4 transition-colors before:absolute before:inset-0 before:content-[''] hover:text-link hover:underline focus-visible:outline-none focus-visible:before:shadow-[var(--shadow-focus-ring)]"
                      >
                        {school.displayName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-secondary">{school.program_count}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      <span className="inline-flex items-center gap-1.5">
                        <StatusDot variant="success" />
                        <span className="text-secondary">{school.submitted_count}</span>
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {school.pending_count > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <StatusDot variant={statusVariant} />
                          <span className="text-secondary">{school.pending_count}</span>
                        </span>
                      ) : <span className="text-tertiary">0</span>}
                    </TableCell>
                    <TableCell><ScaleBadges school={school} c={c} /></TableCell>
                    <TableCell className="text-tertiary" aria-hidden="true"><ArrowRightIcon /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Mobile: compact cards */}
          <div className="flex flex-col gap-2 md:hidden">
            {filtered.map((school) => {
              const statusVariant = school.pending_count > 0 ? "warning" : "success";
              return (
                <Link
                  key={school.name}
                  href={school.href}
                  className="block rounded-lg border border-border-default bg-raised p-3.5 transition-colors hover:border-border-focus hover:bg-hover"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-primary leading-snug">{school.displayName}</h3>
                    <span className="flex-shrink-0 text-tertiary"><ArrowRightIcon /></span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-secondary">
                    <span><strong className="text-primary">{school.program_count}</strong> {c.programsUnit}</span>
                    <span className="inline-flex items-center gap-1"><StatusDot variant="success" />{school.submitted_count} {c.available}</span>
                    {school.pending_count > 0 && <span className="inline-flex items-center gap-1"><StatusDot variant={statusVariant} />{school.pending_count} {c.pending}</span>}
                  </div>
                  {(school.standard_4_count > 0 || school.legacy_5_count > 0 || school.needs_descriptions_count > 0) && (
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      <ScaleBadges school={school} c={c} />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
