import { NextResponse } from "next/server";
import { getProductSummaries } from "@/lib/constants/products";

export async function GET() {
  const products = getProductSummaries();
  return NextResponse.json(products);
}
