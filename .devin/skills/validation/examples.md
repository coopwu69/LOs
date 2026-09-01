# Validation Examples

## Zod: คำตอบ Likert

```ts
import { z } from "zod";

const likertAnswerSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
```

## Zod: ช่อง optional ที่รับค่าว่างจากฟอร์ม

```ts
const optionalCommentSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(1000, "ความคิดเห็นต้องไม่เกิน 1,000 ตัวอักษร").optional(),
);
```

## Cross-field validation

```ts
const periodSchema = z
  .object({ startDate: z.coerce.date(), endDate: z.coerce.date() })
  .refine(({ startDate, endDate }) => endDate >= startDate, {
    path: ["endDate"],
    message: "วันที่สิ้นสุดต้องไม่อยู่ก่อนวันที่เริ่มต้น",
  });
```

ปรับ syntax ให้ตรงเวอร์ชัน Zod และ conventions ที่ติดตั้งในโปรเจกต์ก่อนนำไปใช้
