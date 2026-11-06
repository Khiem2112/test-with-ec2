import { NextResponse, type NextRequest } from "next/server";
import { resolveVoterProfileSchema } from "@/schemas/workspace.schema";
import { resolveVoterProfile } from "@/services/identity.service";

// POST /api/v1/voter-profiles/resolve - Resolve unified voter profile
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const rawBody = (await request.json()) as unknown;
    const parsed = resolveVoterProfileSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_FAILED",
            message: parsed.error.issues[0]?.message ?? "Du lieu khong hop le",
          },
        },
        { status: 400 },
      );
    }

    const voterProfile = await resolveVoterProfile(parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: voterProfile,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message,
        },
      },
      { status: 500 },
    );
  }
};
