import { NextRequest, NextResponse } from "next/server";

// Legacy URL. The role-neutral LO-only Word export that lived here drifted from
// the real forms; every form now downloads from one place, which builds its
// content from the same model as the wizards and the print view.
export async function GET(req: NextRequest, { params }: { params: Promise<{ programId: string }> }) {
  const { programId } = await params;
  const target = req.nextUrl.clone();
  target.pathname = `/programs/${programId}/review/export/company`;
  return NextResponse.redirect(target, 308);
}
