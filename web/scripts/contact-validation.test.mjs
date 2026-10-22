import assert from "node:assert/strict";
import test from "node:test";
import { fullNameSchema, phoneSchema, emailSchema, reviewerSchema, reviewerValidationError } from "../src/lib/contact-validation.ts";

test("full name accepts Thai, English and common name punctuation", () => {
  for (const value of ["สมชาย ใจดี", "John Smith", "Mary-Jane O'Neill", "Dr. John Smith", "  สมชาย   ใจดี  "]) {
    assert.equal(fullNameSchema.safeParse(value).success, true, value);
  }
});
test("full name rejects single names, numbers, symbols and standalone Thai marks", () => {
  for (const value of ["", "   ", "สมชาย", "John", "John123 Smith", "123 456", "John @Smith", "่ ้", "John\nSmith", "<script> Smith"]) {
    assert.equal(fullNameSchema.safeParse(value).success, false, value);
  }
});
test("phone validates separators, leading +, digit count and pasted characters", () => {
  for (const value of ["0812345678", "+66812345678", "081-234-5678", "+66-81-234-5678", "12345678", "123456789012345"]) {
    assert.equal(phoneSchema.safeParse(value).success, true, value);
  }
  for (const value of ["abcdefghij", "--------", "++++++++", "08123abc45", "1234567", "1234567890123456", "081+2345678", "++66812345678", "081--2345678", "0812345678-", "081 234 5678", "(081)2345678", "๐๘๑๒๓๔๕๖๗๘"]) {
    assert.equal(phoneSchema.safeParse(value).success, false, value);
  }
});
test("email rejects malformed addresses and accepts aliases", () => {
  for (const value of ["name@example.com", "first.last+tag@example.co.th", " name@example.com "]) {
    assert.equal(emailSchema.safeParse(value).success, true, value);
  }
  for (const value of ["", "name", "name@", "@example.com", "name@example", "a b@example.com", "a@@example.com", "a..b@example.com"]) {
    assert.equal(emailSchema.safeParse(value).success, false, value);
  }
});
test("reviewer schema and localized errors enforce the same rules", () => {
  const valid = { name: "สมชาย ใจดี", email: "name@example.com", phone: "0812345678" };
  assert.equal(reviewerSchema.safeParse(valid).success, true);
  assert.equal(reviewerValidationError(valid), null);
  for (const patch of [{ name: "สมชาย" }, { email: "bad-email" }, { phone: "abcdefghij" }]) {
    assert.equal(reviewerSchema.safeParse({ ...valid, ...patch }).success, false);
    assert.ok(reviewerValidationError({ ...valid, ...patch }, "th"));
    assert.ok(reviewerValidationError({ ...valid, ...patch }, "en"));
  }
});
