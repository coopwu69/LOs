"use client";

import { useState } from "react";
import { RatingCard, type RatingLevel } from "@/components/evaluation";

const LEVELS_4: RatingLevel[] = [
  { value: 4, label: "ระดับดีมาก", description: "สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้อย่างมีประสิทธิภาพโดยไม่ต้องการการดูแลเพิ่มเติม" },
  { value: 3, label: "ระดับดี", description: "สามารถวางแผน แก้ไขปัญหา และสร้างสรรค์ผลงานได้ โดยมีการดูแลจากผู้นิเทศในบางครั้ง" },
  { value: 2, label: "ระดับพอใช้", description: "สามารถดำเนินงานได้แต่ต้องการการดูแลใกล้ชิดจากผู้นิเทศ" },
  { value: 1, label: "ระดับควรปรับปรุง", description: "ไม่สามารถดำเนินงานตามผลลัพธ์ที่คาดหวังได้" },
];

const LEVELS_4_NO_DESC: RatingLevel[] = [
  { value: 4, label: "ระดับดีมาก" },
  { value: 3, label: "ระดับดี" },
  { value: 2, label: "ระดับพอใช้" },
  { value: 1, label: "ระดับควรปรับปรุง" },
];

const LEVELS_5: RatingLevel[] = [
  { value: 5, label: "ยอดเยี่ยม" },
  { value: 4, label: "ดีมาก" },
  { value: 3, label: "ดี" },
  { value: 2, label: "พอใช้" },
  { value: 1, label: "ต้องปรับปรุง" },
];

export default function DemoPage() {
  const [v1, setV1] = useState<number | undefined>(undefined);
  const [v2, setV2] = useState<number | undefined>(3);
  const [v3, setV3] = useState<number | undefined>(undefined);
  const [v4, setV4] = useState<number | undefined>(undefined);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="mb-10">
        <h1 className="text-2xl font-bold text-primary">RatingCard Demo</h1>
        <p className="mt-2 text-sm text-secondary">
          ทดสอบ component ใหม่ — 4 การ์ดเท่ากัน, controlled, accessible radio group.
        </p>
      </header>

      <section className="space-y-8">
        {/* 1. With descriptions */}
        <div className="rounded-xl border border-border-default bg-raised p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-primary">1. มี description (4 ระดับ)</h2>
          <p className="mb-4 text-sm text-secondary">เหมือนใช้จริงใน wizard — มี rubric บอกรายละเอียดแต่ละระดับ</p>
          <RatingCard
            levels={LEVELS_4}
            value={v1}
            onChange={setV1}
            name="demo-1"
            aria-label="การประเมินพร้อมคำอธิบาย"
          />
        </div>

        {/* 2. No descriptions */}
        <div className="rounded-xl border border-border-default bg-raised p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-primary">2. ไม่มี description (4 ระดับ)</h2>
          <p className="mb-4 text-sm text-secondary">กรณีคำถามที่ยังไม่ได้ใส่ rubric — การ์ดจะกระทัดรัดขึ้น</p>
          <RatingCard
            levels={LEVELS_4_NO_DESC}
            value={v2}
            onChange={setV2}
            name="demo-2"
            aria-label="การประเมินไม่มีคำอธิบาย"
          />
        </div>

        {/* 3. 5 levels */}
        <div className="rounded-xl border border-border-default bg-raised p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-primary">3. 5 ระดับ (ยอดเยี่ยม→ต้องปรับปรุง)</h2>
          <p className="mb-4 text-sm text-secondary">ทดสอบว่า grid ปรับคอลัมน์ตามจำนวน levels ได้</p>
          <RatingCard
            levels={LEVELS_5}
            value={v3}
            onChange={setV3}
            name="demo-3"
            aria-label="การประเมิน 5 ระดับ"
          />
        </div>

        {/* 4. With error */}
        <div className="rounded-xl border border-border-default bg-raised p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-primary">4. มี error state</h2>
          <p className="mb-4 text-sm text-secondary">แสดง error message ด้านล่าง + aria-invalid</p>
          <RatingCard
            levels={LEVELS_4_NO_DESC}
            value={v4}
            onChange={setV4}
            name="demo-4"
            required
            error="กรุณาเลือกระดับการประเมิน"
            aria-label="การประเมินที่มีข้อผิดพลาด"
          />
        </div>

        {/* Keyboard hint */}
        <div className="rounded-lg bg-sunken px-4 py-3 text-sm text-secondary">
          <p className="font-medium text-primary">ทดสอบ keyboard:</p>
          <ul className="mt-2 space-y-1">
            <li><kbd className="rounded border border-border-strong bg-raised px-1.5 py-0.5 text-xs">Tab</kbd> เข้าสู่กลุ่มการ์ด</li>
            <li><kbd className="rounded border border-border-strong bg-raised px-1.5 py-0.5 text-xs">←</kbd> <kbd className="rounded border border-border-strong bg-raised px-1.5 py-0.5 text-xs">→</kbd> เลื่อนและเลือกการ์ด</li>
            <li><kbd className="rounded border border-border-strong bg-raised px-1.5 py-0.5 text-xs">Home</kbd> <kbd className="rounded border border-border-strong bg-raised px-1.5 py-0.5 text-xs">End</kbd> ไปที่การ์ดแรก/สุดท้าย</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
