import { NextResponse } from "next/server";
import { websiteInfo } from "@/lib/constants/website";

export async function GET() {
  return NextResponse.json(websiteInfo);
}
