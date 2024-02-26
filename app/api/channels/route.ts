import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name } = await req.json();
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID missing", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is missing", { status: 400 });
    }

    // TODO: validate channels to avoid duplicate channels
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const workspace = await db.workspace.update({
      where: {
        id: workspaceId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: [
            {
              name,
              profileId: profile.id,
            },
          ],
        },
      },
    });

    return NextResponse.json(workspace);
  } catch (err) {
    console.log("[CHANNEL_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
