import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getProgram, getProgramRouteKey, getRevisions } from "@/lib/db";
import {
  isFixtureMode,
  getFixtureProgram,
  getFixtureRevisions,
  getFixtureTemplateDoc,
} from "@/lib/fixtures";
import type { RevisionRow } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { RestoreButton } from "./RestoreButton";

export const dynamic = "force-dynamic";

const KIND_LABELS: Record<RevisionRow["kind"], { label: string; marker: string }> = {
  import: { label: "นำเข้าข้อมูล", marker: "I" },
  edit: { label: "แก้ไขแบบประเมิน", marker: "E" },
  restore: { label: "คืนค่าเวอร์ชัน", marker: "R" },
};

function formatDate(iso: string): string {
  // iso is "YYYY-MM-DDTHH:MM:SS" in Bangkok time
  const zonedIso = /(Z|[+-]\d{2}:\d{2})$/i.test(iso) ? iso : `${iso}+07:00`;
  const date = new Date(zonedIso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

export default async function HistoryPage({
  params,
}: PageProps<"/programs/[programId]/history">) {
  const { programId } = await params;

  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) notFound();
  const programKey = getProgramRouteKey(program);
  const programPath = `/programs/${programKey}`;
  if (programId !== programKey) permanentRedirect(`${programPath}/history`);

  let revisions: RevisionRow[] = [];
  if (isFixtureMode()) {
    const tpl = getFixtureTemplateDoc(programId);
    revisions = tpl ? getFixtureRevisions(tpl.id) : [];
  } else {
    try {
      const { getPool } = await import("@/lib/db");
      const { rows } = await getPool().query(
        `SELECT id::text FROM evaluation_templates WHERE program_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [program.id]
      );
      if (rows[0]) {
        revisions = await getRevisions(String(rows[0].id));
      }
    } catch {
      revisions = [];
    }
  }

  return (
    <div className="flex-1">
      <PageHeader
        title={`ประวัติการแก้ไข: ${program.name_th}`}
        subtitle="เวอร์ชันทั้งหมดของแบบประเมิน สามารถคืนค่ากลับเป็นเวอร์ชันก่อนหน้าได้"
        breadcrumbs={[
          { label: "หน้าแรก", href: "/" },
          program.school
            ? { label: program.school, href: `/schools/${encodeURIComponent(program.school)}` }
            : { label: "สำนักวิชา" },
          { label: program.name_th, href: programPath },
          { label: "ประวัติ" },
        ]}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {revisions.length === 0 ? (
          <div className="rounded-xl border border-border-default bg-sunken p-8 text-center">
            <h2 className="text-xl font-semibold text-primary">ยังไม่มีประวัติการแก้ไข</h2>
            <p className="mt-2 text-secondary">เมื่อมีการบันทึกหรือนำเข้าแบบประเมิน จะบันทึกเวอร์ชันไว้ที่นี่</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-secondary">
              รายการล่าสุดอยู่ด้านบน — คลิก &quot;คืนค่า&quot; เพื่อกู้คืนเวอร์ชันนั้น
            </p>
            <ol className="relative ml-4 border-l border-border-strong">
              {revisions.map((rev, i) => {
                const kindCfg = KIND_LABELS[rev.kind] ?? { label: rev.kind, marker: "V" };
                const isLatest = i === 0;
                return (
                  <li key={rev.id} className="relative pb-8 pl-8 last:pb-0">
                    <span className="absolute -left-4 top-0 flex size-8 items-center justify-center rounded-full border border-border-strong bg-raised text-xs font-semibold text-action" aria-hidden="true">
                      {kindCfg.marker}
                    </span>
                    <article className="rounded-lg border border-border-default bg-raised p-4 sm:p-5" aria-label={`${kindCfg.label}${isLatest ? " เวอร์ชันล่าสุด" : ""}`}>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-semibold text-primary">{kindCfg.label}</h2>
                            {isLatest && (
                              <span className="inline-flex items-center rounded-full border border-success-text/30 bg-success-bg px-2 py-0.5 text-xs font-medium text-success-text">
                                เวอร์ชันล่าสุด
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-primary">{rev.note ?? "ไม่มีรายละเอียดเพิ่มเติม"}</p>
                          <time dateTime={rev.created_at} className="mt-1 block text-xs text-tertiary">{formatDate(rev.created_at)}</time>
                        </div>
                        {!isLatest && !isFixtureMode() && (
                          <RestoreButton revisionId={rev.id} programId={program.id} programKey={programKey} label="คืนค่าเวอร์ชันนี้" />
                        )}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ol>
          </>
        )}
        <div className="mt-6">
          <Link
            href={programPath}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary hover:bg-hover"
          >
            กลับไปหน้าดูแบบประเมิน
          </Link>
        </div>
      </main>
    </div>
  );
}
