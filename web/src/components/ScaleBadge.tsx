import type { ScaleStatus } from "@/lib/types";

const CONFIG: Record<
  ScaleStatus,
  { label: string; className: string; title: string }
> = {
  standard_4: {
    label: "4 ระดับ ✓",
    className: "bg-success-bg text-success-text border-success-border",
    title: "ใช้เกณฑ์คะแนน 4 ระดับมาตรฐานแล้ว",
  },
  legacy_5: {
    label: "ต้องแก้เป็น 4 ระดับ",
    className: "bg-warning-bg text-warning-text border-warning-border",
    title: "ยังเป็นเกณฑ์ 5 ระดับแบบเดิม ต้องแปลงเป็น 4 ระดับมาตรฐาน",
  },
  needs_descriptions: {
    label: "ต้องเพิ่มคำอธิบายเกณฑ์",
    className: "bg-warning-bg text-warning-text border-warning-border",
    title: "ระดับคะแนนยังไม่มีคำอธิบายเกณฑ์ (description_th)",
  },
};

export function ScaleBadge({ status, className = "" }: { status: ScaleStatus; className?: string }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.className} ${className}`}
      title={cfg.title}
    >
      {cfg.label}
    </span>
  );
}
