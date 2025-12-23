import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET handler for retrieving product configuration options.
 *
 * Fetches available coffee roasts and grind options from the database
 * to populate product customization UI on the frontend.
 *
 * @returns NextResponse with JSON body: { roasts: Roast[], grindOptions: GrindOption[] }
 */
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
