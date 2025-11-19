import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all Roasts and GrindOptions concurrently
    const [roasts, grindOptions] = await Promise.all([
      prisma.roast.findMany(),
      prisma.grindOption.findMany(),
    ]);

    // Return the data in the specified JSON structure
    return NextResponse.json({ roasts, grindOptions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching options data:", error);
    return NextResponse.json(
      { error: "Failed to fetch roast and grind options" },
      { status: 500 }
    );
  }
}
