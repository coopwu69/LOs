import { z } from "zod";

// Thai/English name parts, including initials, apostrophes and hyphens.
// Require at least a given name and surname, separated by spaces.
export const FULL_NAME_PATTERN = /^[A-Za-zก-ฺเ-๎]+(?:[.'’-][A-Za-zก-ฺเ-๎]+)*\.?(?: +[A-Za-zก-ฺเ-๎]+(?:[.'’-][A-Za-zก-ฺเ-๎]+)*\.?)+$/;
export const PHONE_PATTERN = /^\+?[0-9]+(?:-[0-9]+)*$/;

export const fullNameSchema = z.string().trim().min(1, "required").max(200, "length")
  .regex(FULL_NAME_PATTERN, "full_name")
  .refine((value) => value.split(/ +/).every((part) => /[A-Za-zก-ฮ]/.test(part)), "full_name");
export const emailSchema = z.string().trim().min(1, "required").email("email").max(254, "email");
export const phoneSchema = z.string().trim().min(1, "required").max(25, "phone")
  .regex(PHONE_PATTERN, "phone")
  .refine((value) => {
    const digits = value.replace(/\D/g, "").length;
    return digits >= 8 && digits <= 15;
  }, "phone");

export const reviewerSchema = z.object({
  name: fullNameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

export const CONTACT_MESSAGES = {
  th: {
    required: "กรุณากรอกชื่อ-สกุล อีเมล และเบอร์โทรศัพท์ให้ครบ",
    full_name: "กรุณากรอกชื่อและนามสกุล คั่นด้วยช่องว่าง ใช้อักษรไทยหรืออังกฤษ",
    email: "กรุณากรอกอีเมลให้ถูกต้อง เช่น name@example.com",
    phone: "กรุณากรอกเบอร์โทรศัพท์เป็นตัวเลข 8–15 หลัก ใช้ + นำหน้าและ - คั่นได้",
    length: "ข้อมูลยาวเกินไป กรุณากรอกให้สั้นลง",
  },
  en: {
    required: "Please enter your full name, email and phone number.",
    full_name: "Enter your first and last name separated by a space, using Thai or English letters.",
    email: "Enter a valid email address, such as name@example.com.",
    phone: "Enter 8–15 digits, optionally with a leading + and hyphen separators.",
    length: "The value is too long. Please shorten it.",
  },
};

export function reviewerValidationError(input: z.input<typeof reviewerSchema>, locale: "th" | "en" = "th"): string | null {
  const result = reviewerSchema.safeParse(input);
  if (result.success) return null;
  const key = result.error.issues[0].message as keyof typeof CONTACT_MESSAGES.th;
  return CONTACT_MESSAGES[locale][key] ?? CONTACT_MESSAGES[locale].required;
}
