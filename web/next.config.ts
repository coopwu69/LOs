import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  turbopack: {
    root: __dirname,
  },
  // ไฟล์ฟอนต์ถูกอ่านด้วย fs ตอนรันไทม์ จึงต้องบอก tracer ให้รวมไปกับ bundle ของ route นี้
  outputFileTracingIncludes: {
    "/programs/*/export/docx": ["src/assets/fonts/**/*"],
  },
};

export default nextConfig;
