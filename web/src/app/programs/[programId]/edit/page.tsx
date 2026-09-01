import { notFound, permanentRedirect } from "next/navigation";
import { getProgram, getProgramRouteKey, getTemplateDoc, hasEditorSchema } from "@/lib/db";
import {
  isFixtureMode,
  getFixtureProgram,
  getFixtureTemplateDoc,
} from "@/lib/fixtures";
import type { TemplateDoc } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { ScaleBadge } from "@/components/ScaleBadge";
import { ViewEditToggle } from "@/components/ViewEditToggle";
import { TemplateEditor } from "./TemplateEditor";

export const dynamic = "force-dynamic";

export default async function EditPage({
  params,
}: PageProps<"/programs/[programId]/edit">) {
  const { programId } = await params;

  const program = isFixtureMode() ? getFixtureProgram(programId) : await getProgram(programId);
  if (!program) notFound();
  const programKey = getProgramRouteKey(program);
  const programPath = `/programs/${programKey}`;
  if (programId !== programKey) permanentRedirect(`${programPath}/edit`);

  let doc: TemplateDoc | null = null;
  if (isFixtureMode()) {
    doc = getFixtureTemplateDoc(programId);
  } else {
    try {
      doc = await getTemplateDoc(program.id);
    } catch {
      doc = null;
    }
  }

  // In fixture mode there's no real DB to save to — redirect to the read view
  // with a notice instead of pretending to save.
  if (isFixtureMode()) {
    return (
      <div className="flex-1">
        <PageHeader
          title={`แก้ไข: ${program.name_th}`}
          subtitle="โหมดตัวอย่าง (USE_FIXTURES) — ไม่สามารถบันทึกได้"
          breadcrumbs={[
            { label: "หน้าแรก", href: "/" },
            program.school
              ? { label: program.school, href: `/schools/${encodeURIComponent(program.school)}` }
              : { label: "สำนักวิชา" },
            { label: program.name_th, href: programPath },
            { label: "แก้ไข" },
          ]}
        >
          <div className="mt-4">
            <ViewEditToggle active="edit" viewHref={programPath} editHref={`${programPath}/edit`} viewLabel="ดู" editLabel="แก้ไข" groupLabel="เครื่องมือแบบประเมิน" />
          </div>
        </PageHeader>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-xl border border-warning-text/30 bg-warning-bg p-6">
            <h2 className="text-lg font-semibold text-warning-text">
              กำลังทำงานในโหมดตัวอย่าง
            </h2>
            <p className="mt-2 text-sm text-primary">
              ตั้งค่า <code className="rounded bg-sunken px-1.5 py-0.5 text-xs">USE_FIXTURES</code> ออก
              และตั้ง <code className="rounded bg-sunken px-1.5 py-0.5 text-xs">DATABASE_URL</code> ใน
              <code className="ml-1 rounded bg-sunken px-1.5 py-0.5 text-xs">web/.env.local</code>
              เพื่อเปิดใช้งานการแก้ไขจริง
            </p>
            <a
              href={programPath}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-raised px-4 text-sm font-medium text-primary hover:bg-hover"
            >
              กลับไปหน้าดูแบบประเมิน
            </a>
          </div>
        </main>
      </div>
    );
  }

  const editorReady = await hasEditorSchema();
  if (!editorReady) {
    return (
      <div className="flex-1">
        <PageHeader
          title={`แก้ไข: ${program.name_th}`}
          subtitle="ระบบแก้ไขยังไม่พร้อมใช้งานกับฐานข้อมูลชุดนี้"
          breadcrumbs={[
            { label: "หน้าแรก", href: "/" },
            { label: program.name_th, href: programPath },
            { label: "แก้ไข" },
          ]}
        >
          <div className="mt-4">
            <ViewEditToggle active="edit" viewHref={programPath} editHref={`${programPath}/edit`} viewLabel="ดู" editLabel="แก้ไข" groupLabel="เครื่องมือแบบประเมิน" />
          </div>
        </PageHeader>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-xl border border-warning-text/30 bg-warning-bg p-6">
            <h2 className="text-lg font-semibold text-warning-text">ยังไม่สามารถบันทึกการแก้ไขได้</h2>
            <p className="mt-2 text-sm text-primary">ผู้ดูแลระบบต้องติดตั้งส่วนขยายฐานข้อมูลสำหรับการแก้ไขและประวัติก่อน ขณะนี้แบบประเมินและการดาวน์โหลดยังใช้งานได้ตามปกติ</p>
          </div>
        </main>
      </div>
    );
  }

  if (!doc) {
    // No template yet — for now we don't auto-create; show a friendly prompt.
    return (
      <div className="flex-1">
        <PageHeader
          title={`แก้ไข: ${program.name_th}`}
          subtitle="ยังไม่มีแบบประเมินสำหรับหลักสูตรนี้"
          breadcrumbs={[
            { label: "หน้าแรก", href: "/" },
            program.school
              ? { label: program.school, href: `/schools/${encodeURIComponent(program.school)}` }
              : { label: "สำนักวิชา" },
            { label: program.name_th, href: programPath },
            { label: "แก้ไข" },
          ]}
        >
          <div className="mt-4">
            <ViewEditToggle active="edit" viewHref={programPath} editHref={`${programPath}/edit`} viewLabel="ดู" editLabel="แก้ไข" groupLabel="เครื่องมือแบบประเมิน" />
          </div>
        </PageHeader>
        <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="rounded-xl border border-border-default bg-sunken p-8 text-center">
            <h2 className="text-xl font-semibold text-primary">ยังไม่มีแบบประเมินในระบบ</h2>
            <p className="mt-2 text-secondary">
              หลักสูตรนี้ยังไม่มีแม่แบบในฐานข้อมูล กรุณานำเข้าข้อมูลครั้งแรกผ่านสคริปต์นำเข้า
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <PageHeader
        title={`แก้ไข: ${program.name_th}`}
        subtitle={doc.title ?? "แบบประเมิน LOs"}
        breadcrumbs={[
          { label: "หน้าแรก", href: "/" },
          program.school
            ? { label: program.school, href: `/schools/${encodeURIComponent(program.school)}` }
            : { label: "สำนักวิชา" },
          { label: program.name_th, href: programPath },
          { label: "แก้ไข" },
        ]}
      >
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <ViewEditToggle active="edit" viewHref={programPath} editHref={`${programPath}/edit`} viewLabel="ดู" editLabel="แก้ไข" groupLabel="เครื่องมือแบบประเมิน" />
          <span className="inline-flex items-center rounded-md bg-white/15 px-2 py-1 text-xs font-mono font-medium text-white">
            {program.code}
          </span>
          <ScaleBadge status={doc.scale_status} />
        </div>
      </PageHeader>

      <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <TemplateEditor doc={doc} programKey={programKey} />
      </main>
    </div>
  );
}
